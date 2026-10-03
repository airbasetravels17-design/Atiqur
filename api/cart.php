<?php
/**
 * AURA STUDIO - CART API ENDPOINT
 */
define('AURA_APP', true);
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../core/Database.php';
require_once __DIR__ . '/../core/Security.php';
require_once __DIR__ . '/../core/Cart.php';

Security::setSecurityHeaders();

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? ($method === 'POST' ? 'add' : 'get');

if ($method === 'GET' && $action === 'get') {
    $destination = $_GET['destination'] ?? 'inside_dhaka';
    echo json_encode([
        'success'    => true,
        'items'      => array_values(Cart::getItems()),
        'cart_count' => Cart::getCount(),
        'totals'     => Cart::getTotals($destination)
    ]);
    exit;
}

if ($method === 'POST') {
    // Parse json payload or form-data
    $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;

    if ($action === 'add') {
        $variantId = (int)($input['variant_id'] ?? 0);
        $qty = max(1, (int)($input['quantity'] ?? 1));

        if ($variantId <= 0) {
            echo json_encode(['success' => false, 'message' => 'Please select a valid color and size combination.']);
            exit;
        }

        $res = Cart::addItem($variantId, $qty);
        echo json_encode($res);
        exit;
    }

    if ($action === 'update') {
        $variantId = (int)($input['variant_id'] ?? 0);
        $qty = (int)($input['quantity'] ?? 1);
        $res = Cart::updateQuantity($variantId, $qty);
        echo json_encode($res);
        exit;
    }

    if ($action === 'remove') {
        $variantId = (int)($input['variant_id'] ?? 0);
        $res = Cart::removeItem($variantId);
        echo json_encode($res);
        exit;
    }

    if ($action === 'clear') {
        Cart::clear();
        echo json_encode(['success' => true, 'message' => 'Cart emptied.']);
        exit;
    }
}

echo json_encode(['success' => false, 'message' => 'Unsupported API method.']);
