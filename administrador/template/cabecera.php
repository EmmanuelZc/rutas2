<!DOCTYPE html>
<html lang="en">
<head>
    <title>Title</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    

    <link rel= "stylesheet" href="./css/b.min.css"/>




</head>
<body>
    <?php $url="https://" . $_SERVER['HTTP_HOST'] . "/sitioweb"; ?>
    
    
    <nav class="navbar navbar-expand navbar-light bg-light">
        <div class="nav navbar-nav">
            <a class="nav-item nav-link" href="<?php echo $url;?>/administrador/seccion/seccion.php">Registros</a>
            <a class="nav-item nav-link" href="<?php echo $url;?>/administrador/seccion/modificar.php">Modificar</a>
            <li class="nav-item">
                <a class="nav-link" href="parada.php">Agregar Parada</a>
            </li>
         <a class="nav-item nav-link" href="<?php echo $url;?>/administrador/index.php">Rutas Existentes</a>
        </div>
    </nav>


    <div class="container">
    </br>
    <div clas="row">