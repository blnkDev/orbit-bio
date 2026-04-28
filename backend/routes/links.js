const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { db } = require('../database');

router.get('/', auth, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM links WHERE user_id = $1 ORDER BY position ASC', [req.user.id]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar links' });
  }
});

router.post('/', auth, async (req, res) => {
  const { title, url, type } = req.body;
  if (!title || !url) {
    return res.status(400).json({ message: 'Dados inválidos' });
  }

  try {
    const result = await db.query(
      'INSERT INTO links (user_id, title, url, type) VALUES ($1, $2, $3, $4) RETURNING id',
      [req.user.id, title, url, type || 'link']
    );
    res.status(201).json({ id: result.rows[0].id });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao adicionar link' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await db.query('DELETE FROM links WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
    res.json({ message: 'Link excluído' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao excluir link' });
  }
});

router.put('/reorder', auth, async (req, res) => {
  const { linkIds } = req.body;
  if (!linkIds || !Array.isArray(linkIds)) {
    return res.status(400).json({ message: 'Dados inválidos' });
  }

  const isSQLite = require('../database').isSQLite;
  const client = await db.connect();
  try {
    if (!isSQLite) await client.query('BEGIN');
    for (let i = 0; i < linkIds.length; i++) {
      await client.query('UPDATE links SET position = $1 WHERE id = $2 AND user_id = $3', [i, linkIds[i], req.user.id]);
    }
    if (!isSQLite) await client.query('COMMIT');
    res.json({ message: 'Ordem atualizada' });
  } catch (error) {
    if (!isSQLite) await client.query('ROLLBACK');
    res.status(500).json({ message: 'Erro ao reordenar links' });
  } finally {
    if (!isSQLite) client.release();
  }
});

module.exports = router;
