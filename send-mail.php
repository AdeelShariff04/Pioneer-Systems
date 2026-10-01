<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;

require __DIR__ . '/vendor/autoload.php';

header('Content-Type: application/json; charset=utf-8');

function respond(int $statusCode, string $status, string $message): void
{
    http_response_code($statusCode);
    echo json_encode(['status' => $status, 'message' => $message]);
    exit;
}

function postValue(string $key): string
{
    $value = $_POST[$key] ?? '';
    return is_string($value) ? trim($value) : '';
}

function escapeHtml(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(405, 'error', 'Only POST requests are accepted.');
}

$name = str_replace(["\r", "\n"], ' ', postValue('name'));
$email = postValue('email');
$isInquiry = isset($_POST['product_name']);
$fields = $isInquiry
    ? [
        'Name' => $name,
        'Email' => $email,
        'Contact' => postValue('contact'),
        'Product' => postValue('product_name'),
    ]
    : [
        'Name' => $name,
        'Email' => $email,
        'Subject' => postValue('subject'),
        'Message' => postValue('message'),
    ];

if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(400, 'error', 'Please provide your name and a valid email address.');
}

if ($isInquiry && ($fields['Contact'] === '' || $fields['Product'] === '')) {
    respond(400, 'error', 'Please provide your contact number and product.');
}

if (!$isInquiry && $fields['Message'] === '') {
    respond(400, 'error', 'Please enter a message.');
}

$rows = '';
foreach ($fields as $label => $value) {
    $displayValue = $value === '' ? '-' : nl2br(escapeHtml($value));
    $rows .= '<tr><th style="padding:8px;text-align:left;border-bottom:1px solid #ddd">'
        . escapeHtml($label)
        . '</th><td style="padding:8px;border-bottom:1px solid #ddd">'
        . $displayValue
        . '</td></tr>';
}

$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host = 'mail.pioneersystem.org';
    $mail->SMTPAuth = true;
    $mail->Username = 'info@pioneersystem.org';
    $mail->Password = 'Automated5823';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port = 465;
    $mail->CharSet = PHPMailer::CHARSET_UTF8;

    $mail->setFrom('info@pioneersystem.org', 'Pioneer Systems');
    $mail->addAddress('info@pioneersystem.org');
    $mail->addReplyTo($email, $name);
    $mail->isHTML(true);
    $mail->Subject = $isInquiry ? 'Product inquiry' : 'Contact form message';
    $mail->Body = '<div style="font-family:Arial,sans-serif;color:#222">'
        . '<h2>' . ($isInquiry ? 'Product Inquiry' : 'Contact Form Message') . '</h2>'
        . '<table style="border-collapse:collapse;width:100%;max-width:640px">'
        . $rows
        . '</table></div>';
    $mail->AltBody = implode("\n", array_map(
        static fn (string $label, string $value): string => "$label: $value",
        array_keys($fields),
        array_values($fields)
    ));

    $mail->send();
    respond(200, 'success', 'Thank you. Your message has been sent.');
} catch (Throwable $error) {
    // Return the actual error message during testing so you can see if SMTP credentials fail
    respond(500, 'error', 'Mailer Error: ' . $mail->ErrorInfo . ' | ' . $error->getMessage());
}