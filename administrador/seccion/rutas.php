<?php
include('template/cabecera.php'); 
include("../config/bd.php");

session_start(); // Iniciar la sesión para acceder a $_SESSION

// Verifica si el usuario ha iniciado sesión
if (!isset($_SESSION['usuario'])) {
    // Si no está logueado, redirige a la página de login
    header("Location: index.php"); // Redirige a la página de login
    exit();
}

// Accede al usuario logueado
$usuario = $_SESSION['usuario'];
$conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);



// Obtener todas las rutas para el filtro
$sentenciaSQL = $conexion->prepare("SELECT DISTINCT ruta FROM `rutas turisticas`");
$sentenciaSQL->execute();
$rutasDisponibles = $sentenciaSQL->fetchAll(PDO::FETCH_ASSOC);




// Manejo de las acciones POST
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $txtID = $_POST['txtID'] ?? "";
    $accion = $_POST['accion'] ?? "";
    $txtFiltroRuta = $_POST['txtFiltroRuta'] ?? ""; // Capturar el filtro de ruta

    switch ($accion) {
        case "Filtrar":
            // Consulta para filtrar las rutas por nombre
            $sqlFiltro = "SELECT * FROM `rutas turisticas` WHERE ruta LIKE :ruta";
            $sentenciaSQL = $conexion->prepare($sqlFiltro);
            $sentenciaSQL->bindValue(':ruta', '%' . $txtFiltroRuta . '%'); // Buscar por la ruta con LIKE
            $sentenciaSQL->execute();
            $Rutas = $sentenciaSQL->fetchAll(PDO::FETCH_ASSOC); // Actualizamos $Rutas con el resultado filtrado
            break;

            case "Seleccionar":
                // Consulta para obtener todos los datos de la ruta seleccionada por el ID
                $sentenciaSQL = $conexion->prepare("SELECT * FROM `rutas turisticas` WHERE id = :id");
                $sentenciaSQL->bindParam(':id', $txtID);
                $sentenciaSQL->execute();
                $Ruta = $sentenciaSQL->fetch(PDO::FETCH_ASSOC); // Usamos fetch en lugar de fetchAll para obtener solo un registro
                
                // Verificar que se haya encontrado la ruta
                if ($Ruta) {
                    // Construir la URL con el ID y los datos esenciales para la modificación
                    $url = "https://localhost/sitioweb/administrador/seccion/modificar.php?id=" . urlencode($Ruta['id']);
                    
                    // Opcional: Si deseas agregar más parámetros para la modificación, hazlo de manera controlada
                    // Por ejemplo, solo los datos que el formulario necesitará, como la ruta:
                    $url .= "&ruta=" . urlencode($Ruta['ruta']);
                    
                    // Redirigir al usuario a la página de modificación con los parámetros en la URL
                    header("Location: $url");
                    exit(); // Detener la ejecución del script después de la redirección
                } else {
                    echo "❌ No se encontró la ruta.";
                }
                break;
            

        case "Borrar":
            try {
                $sentenciaSQL = $conexion->prepare("DELETE FROM `rutas turisticas` WHERE id = :id");
                $sentenciaSQL->bindParam(':id', $txtID);
                $sentenciaSQL->execute();
                echo "✅ Registro eliminado correctamente.";
            } catch (PDOException $e) {
                echo "❌ Error al eliminar: " . $e->getMessage();
            }
            break;
    }
}

// Si no se está filtrando, obtener todas las rutas
if (!isset($Rutas)) {
    $sentenciaSQL = $conexion->prepare("SELECT * FROM `rutas turisticas`");
    $sentenciaSQL->execute();
    $Rutas = $sentenciaSQL->fetchAll(PDO::FETCH_ASSOC);
}

?>

<!-- Formulario de filtro por ruta -->
<div class="container-fluid">
    <div class="row">
        <div class="col-12">
            <form method="post" class="mb-3">
                <!-- Filtro por Ruta (select) -->
                <select name="txtFiltroRuta" class="form-control">
                    <option value="">Selecciona una ruta</option>
                    <?php foreach ($rutasDisponibles as $ruta): ?>
                        <option value="<?php echo htmlspecialchars($ruta['ruta'], ENT_QUOTES, 'UTF-8'); ?>"
                            <?php echo (isset($_POST['txtFiltroRuta']) && $_POST['txtFiltroRuta'] == $ruta['ruta']) ? 'selected' : ''; ?>>
                            <?php echo htmlspecialchars($ruta['ruta'], ENT_QUOTES, 'UTF-8'); ?>
                        </option>
                    <?php endforeach; ?>
                </select>
                <button type="submit" name="accion" value="Filtrar" class="btn btn-primary mt-2">Filtrar</button>
            </form>
        </div>
    </div>
</div>

<!-- Contenedor de la tabla y formularios con scroll horizontal -->
<div class="container-fluid">
    <div class="row">
        <div class="col-12">
            <div class="table-responsive">
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th>Ruta</th>
                            <th>No. Parada</th>
                            <th>Origen</th>
                            <th>Lat y Long Origen</th>
                            <th>Destino</th>
                            <th>Lat y Long Destino</th>
                            <th>Horario Inicio</th>
                            <th>Horario Fin</th>
                            <th>Kilómetros</th>
                            <th>Tipo Vehículo</th>
                            <th>Lic. Fecha Inicio Cad.</th>
                            <th>Lic. No. Autorización</th>
                            <th>Lic. Fecha Fin Caducidad</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($Rutas as $Ruta) { ?>
                        <tr>
                            <td> <?php echo $Ruta['ruta']; ?> </td>
                            <td> <?php echo $Ruta['ID_parada']; ?> </td>
                            <td> <?php echo $Ruta['calle_o'] . ' ' . $Ruta['numero_o'] . ' ' . $Ruta['col_o'] . ' ' . $Ruta['cp_o'] . ' ' . $Ruta['ctra_o']. ' ' . $Ruta['Km_o'] . ' ' . $Ruta['desc_o'] . ' ' . $Ruta['loc_o'] . ' ' . $Ruta['cd_o']; ?> </td>
                            <td> <?php echo $Ruta['lat_o'] . ' ' . $Ruta['long_o']; ?> </td>
                            <td> <?php echo $Ruta['calle_d'] . ' ' . $Ruta['numero_d'] . ' ' . $Ruta['col_d'] . ' ' . $Ruta['cp_d'] . ' ' . $Ruta['ctra_d']. ' ' . $Ruta['Km_d'] . ' ' . $Ruta['desc_d'] . ' ' . $Ruta['loc_d'] . ' ' . $Ruta['cd_d']; ?> </td>
                            <td> <?php echo $Ruta['lat_d'] . ' ' . $Ruta['long_d']; ?> </td>
                            <td> <?php echo $Ruta['horario_in']; ?> </td>
                            <td> <?php echo $Ruta['horario_fin']; ?> </td>
                            <td> <?php echo $Ruta['kms']; ?> </td>
                            <td> <?php echo $Ruta['tipo_veh']; ?> </td>
                            <td> <?php echo $Ruta['fecha']; ?> </td>
                            <td> <?php echo $Ruta['no_aut']; ?> </td>
                            <td> <?php echo $Ruta['caducidad']; ?> </td>
                            <td> 
                                <!-- Formulario con los botones, solo visibles si el usuario está logueado -->
                                <form method="post" style="display: flex; gap: 10px; align-items: center; justify-content: center;">
                                    <input type="hidden" name="txtID" value="<?php echo $Ruta['id']; ?>">

                                    <?php if ($usuario == 'admin'): ?>
                                        <input type="submit" name="accion" value="Seleccionar" class="btn btn-primary">
                                        <input type="submit" name="accion" value="Borrar" class="btn btn-danger">
                                    <?php endif; ?>

                                    <?php if ($usuario == 'editor'): ?>
                                        <input type="submit" name="accion" value="Seleccionar" class="btn btn-primary">
                                    <?php endif; ?>
                                </form>
                            </td>
                        </tr>
                        <?php } ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>

<!-- Estilo CSS para hacer más grande la tabla y ajustar las columnas -->
<style>
    .table-responsive {
        width: 100%;
        overflow-x: auto;
    }

    .table {
        width: 100%; /* Asegura que la tabla ocupe todo el ancho disponible */
        table-layout: auto; /* Permite que las columnas se ajusten según el contenido */
    }

    .table th, .table td {
        text-align: center; /* Alinea el texto en el centro */
        padding: 12px; /* Espaciado dentro de las celdas */
    }

    .table td, .table th {
        word-wrap: break-word; /* Rompe las palabras largas */
    }
</style>

<?php include('template/pie.php'); ?>
