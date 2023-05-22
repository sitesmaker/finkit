<?php
    $data = json_decode(file_get_contents('php://input'), true);
    $con = new mysqli("localhost", "root", "root", "test_auth");

    if(!empty($data) && $con) {
        $login = htmlspecialchars(trim($data['login']));

        $con -> query("CREATE TABLE IF NOT EXISTS users (
            id INT NOT NULL AUTO_INCREMENT,
            PRIMARY KEY(id),
            login char(255) NOT NULL,
            password char(255) NOT NULL
        )");

        // Выборка пользователя
        $stmt = $con->prepare("SELECT * FROM users WHERE login=?");
        $stmt->bind_param("s", $login);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();
        
        // Выборка данных
        $stmt = $con->prepare("SELECT * FROM users_data WHERE id=?");
        $stmt->bind_param("s", $row['id']);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();

        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($row);
    }
?>