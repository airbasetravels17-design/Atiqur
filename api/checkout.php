<?php
/**
 * AURA STUDIO - CHECKOUT API ENDPOINT
 */
define('AURA_APP', true);
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../core/Database.php';
require_once __DIR__ . '/../core/Security.php';
require_once __DIR__ . '/../core/Cart.php';
require_once __DIR__ . '/../models/Order.php';

Security::setSecurityHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Only POST requests allowed.']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true) ?: $_POST;

$res = Order::createFromCart($input);
echo json_encode($res);
