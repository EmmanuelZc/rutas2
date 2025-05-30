<!DOCTYPE html>
<html lang="en">
<head>
    <title>Title</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <link rel="stylesheet" href="./css/b.min.css"/>
</head>
<body>
    <div class="container mt-5">
        <h2 class="text-center">Inicio de Sesión</h2>
        
        <form action="index.php" method="POST">
            <div class="form-group">
                <label for="usuario">Usuario:</label>
                <input type="text" class="form-control" id="usuario" name="usuario" required>
            </div>
            <div class="form-group">
                <label for="contrasena">Contraseña:</label>
                <input type="password" class="form-control" id="contrasena" name="contrasena" required>
            </div>
            <button type="submit" class="btn btn-primary btn-block">Ingresar</button>
        </form>
    </div>
</body>
</html>

<?php
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $usuario = $_POST['usuario'] ?? '';
    $contrasena = $_POST['contrasena'] ?? '';

    $usuarios = [
        'admin' => '1234',
        'editor' => '5678',
        'visualizar' => 'abcd'
    ];

    if (isset($usuarios[$usuario]) && $usuarios[$usuario] === $contrasena) {
        $_SESSION['usuario'] = $usuario;


        


        $url = "https://localhost/sitioweb/administrador/seccion/registro.php?";
                foreach ($Ruta as $key => $value) {
                    $url .= $key . "=" . urlencode($value) . "&"; // Añadir cada campo a la URL como parámetro
                }
                $url = rtrim($url, "&"); // Eliminar el último "&" extra

                // Redirigir al usuario a la página de modificación con los parámetros en la URL
                header("Location: $url");
                exit(); // Detener la ejecución del script después de la redirección
    } else {
        echo '<p class="text-danger text-center">Usuario o contraseña incorrectos.</p>';
    }
}
?>


