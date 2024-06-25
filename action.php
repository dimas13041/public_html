<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
// Подключение файлов PHPMailer
require 'phpmailer/src/Exception.php';
require 'phpmailer/src/PHPMailer.php';
require 'phpmailer/src/SMTP.php';
// Фиксированный адрес отправителя
$SENDER_EMAIL = 'Vi.carmats@gmail.com';
$recipientEmail = 'vavanka56@gmail.com';

// Настройки почтового сервера
$mail = new PHPMailer(true);
$mail->isSMTP();
$mail->SMTPDebug = 2;
$mail->Host = 'smtp.gmail.com';
$mail->Port = 465;
$mail->SMTPSecure = 'ssl';
$mail->SMTPAuth = true;
$mail->Username = 'Vi.carmats@gmail.com';
$mail->Password = 'kjinkzwzzkbyprof';

// Функция для отправки письма с номером телефона
function sendPhoneEmail($data, $mail) {

    global $SENDER_EMAIL;
    global $recipientEmail;

    try {
        $userPhone = $data['userPhone'];
        $date = $data['date'];

        $mail->setFrom($SENDER_EMAIL);
        $mail->addAddress($recipientEmail);

        $mail->Subject = 'Consultation by phone number';
        $mail->Body = "Consultation by phone number\nClients phone number: $userPhone\nDate and time: $date";

        $mail->send();
        return true;
    } catch (Exception $e) {
        return $e->getMessage();
    }
}

// Функция для отправки заказа
function sendOrderEmail($data, $mail) {

    global $recipientEmail;
    try {
        $carMake = $data['carMake'];
        $carModel = $data['carModel'];
        $carYear = $data['carYear'];
        $rugBackgroundColor = $data['rugBackgroundColor'];
        $rugOutlineColor = $data['rugOutlineColor'];
        $setType = $data['setType'];
        $userPhone = $data['userPhone'];
        $userName = $data['userName'];
        $userEmail = $data['userEmail'];
        $date = $data['date'];

        $mail->clearAddresses();
        $mail->addAddress($recipientEmail);

        $mail->Subject = 'New order';
        $mail->Body = "CarMat order:\nCar make: $carMake\nCar model: $carModel\nCar year: $carYear\nCarmat color: $rugBackgroundColor\nTrim color: $rugOutlineColor\nSet type: $setType\nClients Name: $userName\nClients phone number: $userPhone\nClients email: $userEmail\nDate and time: $date";

        $mail->send();

        // Отправка подтверждения клиенту
        $mail->clearAddresses();
        $mail->addAddress($userEmail);

        $mail->Subject = 'Confirmation of Your EVA Carmats Order';
        $mail->Body = "Dear $userName,\n\nWe appreciate your recent order for car mats and are excited to share that it has been successfully processed. Your choice in enhancing your vehicle's interior with our new generation car mats is valued.\n\nHere are the details of your order:\n• Product:\nCar make - $carMake;\nCar model - $carModel;\nCar year - $carYear;\nMat color - $rugBackgroundColor;\nTrim color - $rugOutlineColor\n• Set Name: $setType (+Footrest for a driver mat as a gift!)\n\nOur team will be reaching out to you shortly to confirm the order and shipping information any questions you may have. Your satisfaction is our priority, and we are committed to ensuring a seamless experience.\n\nShould you need immediate assistance, feel free to contact our customer service team at +1 613-985-7956.\n\nThank you for choosing us for your automotive accessory needs. We look forward to serving you.\n\nBest regards,\nV&I Carmats\n+1 613-985-7956";

        $mail->send();

        return true;
    } catch (Exception $e) {
        return $e->getMessage();
    }
}

// Функция для отправки вопросов
function sendQuestionsEmail($data, $mail) {
    global $recipientEmail;
    try {
        $userName = $data['userName'];
        $userEmail = $data['userEmail'];
        $userMessage = $data['userMessage'];
        $date = $data['date'];

        $mail->clearAddresses();
        $mail->addAddress($recipientEmail);

        $mail->Subject = 'Questions';
        $mail->Body = "Clients Name: $userName\nClients Email: $userEmail\nClients Question: $userMessage\nDate and time: $date";

        $mail->send();
        return true;
    } catch (Exception $e) {
        return $e->getMessage();
    }
}

// Обработчик POST запросов
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
   
    $jsonData = file_get_contents('php://input');
    $data = json_decode($jsonData, true);
    $formName = $data['formName'];

    $mail->isHTML(false);
    $successMessage = "Your request was sent successfully!";

    switch ($formName) {
        case 'getGift':
            $result = sendPhoneEmail($data, $mail);
            break;
        case 'priceConstructor':
            $result = sendOrderEmail($data, $mail);
            break;
        case 'feedback':
            $result = sendQuestionsEmail($data, $mail);
            $successMessage = "Your message was sent successfully!";
            break;
        default:
            $result = 'Invalid endpoint';
            break;
    }

    if ($result === true) {
        http_response_code(200);
    } else {
        http_response_code(500);
    }
}
?>