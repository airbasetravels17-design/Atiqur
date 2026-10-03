<?php
/**
 * AURA STUDIO - TRACK ORDER API ENDPOINT
 */
define('AURA_APP', true);
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../core/Database.php';
require_once __DIR__ . '/../core/Security.php';
require_once __DIR__ . '/../models/Order.php';

Security::setSecurityHeaders();

$orderNumber = trim($_GET['order_number'] ?? '');
$phone = trim($_GET['phone'] ?? '');

if (empty($orderNumber) || empty($phone)) {
    echo json_encode(['success' => false, 'message' => 'Please provide both your Order ID and contact Phone number.']);
    exit;
}

$order = Order::findByNumberAndPhone($orderNumber, $phone);

if (!$order) {
    echo json_encode(['success' => false, 'message' => 'No matching order found for the provided details.']);
    exit;
}

echo json_encode([
    'success' => true,
    'order'   => [
        'order_number'    => $order['order_number'],
        'order_status'    => $order['order_status'],
        'customer_name'   => $order['customer_name'],
        'grand_total'     => $order['grand_total'],
        'created_at'      => $order['created_at'],
        'city'            => $order['city'],
        'items'           => $order['items'],
        'history'         => $order['history']
    ]
]);
