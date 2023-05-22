<?php
    $con = new mysqli("localhost", "root", "root", "test_auth");

    if (mysqli_connect_errno()){
        echo "Failed to connect to MySQL: " . mysqli_connect_error();
    } 
    
    $data = json_decode(file_get_contents('php://input'), true);

    if(!empty($data) && $con) {
        $login = $data['login'] ?? null;
        $password = $data['password'] ?? null;
        $logout = $data['logout'] ?? null;

        if(!empty($login) && !empty($password)) {
            $login = htmlspecialchars(trim($login));
            $password = htmlspecialchars(trim($password));

            $con -> query("CREATE TABLE IF NOT EXISTS users (
                id INT NOT NULL AUTO_INCREMENT,
                PRIMARY KEY(id),
                login char(255) NOT NULL,
                password char(255) NOT NULL
            )");

            $stmt = $con->prepare("SELECT * FROM users WHERE login=?");
            $stmt->bind_param("s", $login);
            $stmt->execute();

            /* Для вставки юзера - но нужно заполнить вторую базу,
            чтобы у пользователя были данные а то упадёт эксепшен и дальше работать не будет - я это делал ручками */
            
            // if(!$stmt->fetch()) {
            //     $password = password_hash($password, PASSWORD_BCRYPT);
            //     $sql ="INSERT INTO users(login,password) VALUES ('$login','$password')";
            //     $con->query($sql);
            // }

            $result = $stmt->get_result();
            $row = $result->fetch_assoc();
            
            if(isset($row)) {
                if($row['login'] === $login && password_verify($password, $row['password'])) {
                    setcookie('login', $login, 0, '/');
                    http_response_code(200);
                    header('Content-Type: application/json; charset=utf-8');
                    echo json_encode(["cookies" => "Вы ввели неверный логин или пароль"]);
                } else {
                    http_response_code(401);
                    header('Content-Type: application/json; charset=utf-8');
                    echo json_encode(["error" => "Вы ввели неверный логин или пароль"]);
                    exit;
                }
            } else {
                http_response_code(401);
                header('Content-Type: application/json; charset=utf-8');
                echo json_encode(["error" => "Вы ввели неверный логин или пароль"]);
                exit;
            }
        } else if(!empty($login) && !empty($password) && $logout) {
            http_response_code(401);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(["error" => "Вы не ввели логин и пароль"]);
        }
        
        if($logout) {
            if (isset($_COOKIE['login'])) {
                unset($_COOKIE['login']); 
                setcookie('login', '', -1, '/'); 
                http_response_code(200);
                header('Content-Type: application/json; charset=utf-8');
                echo json_encode(["logout" => true]);
            } else {
                return false;
            }
        }
    }
?>