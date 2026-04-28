const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { db } = require('../database');

router.get('/profile', auth, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, username, avatar, bio, wallpaper_url, profile_opacity, profile_blur, location, text_color, bg_color, icon_color, font_family, cursor_type, music_url, show_verified_badge, card_animation, display_name, show_username, glow_intensity, wallpaper_blur, wallpaper_brightness, wallpaper_overlay_color, reveal_animation, reveal_duration FROM users WHERE id = $1',
      [req.user.id]
    );
    const user = result.rows[0];
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar perfil' });
  }
});

router.put('/profile', auth, async (req, res) => {
  const { 
    avatar, bio, wallpaper_url, 
    profile_opacity, profile_blur, location, 
    text_color, bg_color, icon_color,
    font_family, cursor_type, music_url, show_verified_badge, card_animation,
    display_name, show_username, glow_intensity,
    wallpaper_blur, wallpaper_brightness, wallpaper_overlay_color,
    reveal_animation, reveal_duration
  } = req.body;

  const fields = {
    avatar, bio, wallpaper_url, 
    profile_opacity, profile_blur, location, 
    text_color, bg_color, icon_color,
    font_family, cursor_type, music_url, show_verified_badge, card_animation,
    display_name, show_username, glow_intensity,
    wallpaper_blur, wallpaper_brightness, wallpaper_overlay_color,
    reveal_animation, reveal_duration
  };

  const setClauses = Object.keys(fields)
    .map((key, index) => `${key} = $${index + 1}`)
    .join(', ');
  
  const values = Object.values(fields);

  try {
    await db.query(
      `UPDATE users SET ${setClauses} WHERE id = $${values.length + 1}`,
      [...values, req.user.id]
    );
    res.json({ message: 'Perfil atualizado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar perfil' });
  }
});
const { USERNAME_REGEX } = require('../utils/validators');

router.put('/username', auth, async (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ message: 'Username é obrigatório.' });
  
  if (username.length < 3 || username.length > 20) {
    return res.status(400).json({ message: 'Username deve ter entre 3 e 20 caracteres.' });
  }

  if (!USERNAME_REGEX.test(username)) {
    return res.status(400).json({ message: 'Username inválido. Apenas letras, números e underlines.' });
  }

  try {
    // Verifica se já existe outro usuário com esse username
    const existing = await db.query('SELECT id FROM users WHERE username = $1 AND id != $2', [username, req.user.id]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ message: 'Este nome de usuário já está em uso.' });
    }

    await db.query('UPDATE users SET username = $1 WHERE id = $2', [username, req.user.id]);
    res.json({ message: 'Username atualizado com sucesso.', username });
  } catch (error) {
    // Em caso de race condition no UNIQUE constraint, o catch vai pegar
    if (error.code === '23505' || (error.message && error.message.includes('UNIQUE constraint failed'))) {
      return res.status(409).json({ message: 'Este nome de usuário já está em uso.' });
    }
    res.status(500).json({ message: 'Erro ao atualizar username.' });
  }
});

module.exports = router;
