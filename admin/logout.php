<?php
/**
 * AURA STUDIO - ADMIN LOGOUT
 */
define('AURA_APP', true);
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../core/Auth.php';

Auth::logout();
header('Location: ' . BASE_URL . '/admin/login.php');
exit;
