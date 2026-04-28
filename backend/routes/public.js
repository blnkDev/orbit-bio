const express = require('express');
const router = express.Router();
const { db } = require('../database');

router.get('/:username', async (req, res) => {
  const { username } = req.params;

  try {
    // Incrementar visualizações
    await db.query('UPDATE users SET views = views + 1 WHERE username = $1', [username]);

    const userResult = await db.query(
      'SELECT id, username, avatar, bio, wallpaper_url, profile_opacity, profile_blur, location, text_color, bg_color, icon_color, font_family, cursor_type, music_url, show_verified_badge, card_animation, display_name, show_username, glow_intensity, views, wallpaper_blur, wallpaper_brightness, wallpaper_overlay_color, reveal_animation, reveal_duration FROM users WHERE username = $1',
      [username]
    );

    const user = userResult.rows[0];
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const linksResult = await db.query('SELECT * FROM links WHERE user_id = $1 ORDER BY position ASC', [user.id]);
    const links = linksResult.rows;

    res.json({ user, links });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar dados do perfil' });
  }
});

module.exports = router;
