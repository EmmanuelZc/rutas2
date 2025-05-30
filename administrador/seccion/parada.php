<?php
include('template/cabecera.php');

// Incluir conexión a la base de datos
include("../config/bd.php");

// Habilitar errores PDO
$conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);




// Mostrar errores PHP en el navegador (para depuración)
ini_set('display_errors', 1);
error_reporting(E_ALL);



// Obtener todas las rutas desde la base de datos
try {
    $consulta = $conexion->prepare("SELECT DISTINCT ruta FROM `rutas turisticas`");
    $consulta->execute();
    $rutas = $consulta->fetchAll(PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    echo "Error al obtener las rutas: " . $e->getMessage();
}

// Recuperar el ID de la URL (si existe)
$id = $_GET['id'] ?? null;

// Verificar si se han enviado datos por POST
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Capturar datos del formulario
    $txtID = $_POST['txtID'] ?? "";


    // Obtener la ruta del formulario o generar una por defecto
    $txtruta = $_POST['txtruta'] ?? "";

    // Recoger los demás valores del formulario
    $txtID_parada = $_POST['txtID_parada'] ?? "";
    $txtpunto_conocido_o = $_POST['txtpunto_conocido_o'] ?? "";
    $txtlat_o = $_POST['txtlat_o'] ?? "";
    $txtlong_o = $_POST['txtlong_o'] ?? "";
    $txtcd_o = $_POST['txtcd_o'] ?? "";
    $txtloc_o = $_POST['txtloc_o'] ?? "";
    $txtcalle_o = $_POST['txtcalle_o'] ?? "";
    $txtnumero_o = $_POST['txtnumero_o'] ?? "";
    $txtcol_o = $_POST['txtcol_o'] ?? "";
    $txtcp_o = $_POST['txtcp_o'] ?? "";
    $txtctra_o = $_POST['txtctra_o'] ?? "";
    $txtKm_o = $_POST['txtKm_o'] ?? "";
    $txtdesc_o = $_POST['txtdesc_o'] ?? "";
    $txtpunto_conocido_d = $_POST['txtpunto_conocido_d'] ?? "";
    $txtlat_d = $_POST['txtlat_d'] ?? "";
    $txtlong_d = $_POST['txtlong_d'] ?? "";
    $txtcd_d = $_POST['txtcd_d'] ?? "";
    $txtloc_d = $_POST['txtloc_d'] ?? "";
    $txtcalle_d = $_POST['txtcalle_d'] ?? "";
    $txtnumero_d = $_POST['txtnumero_d'] ?? "";
    $txtcol_d = $_POST['txtcol_d'] ?? "";
    $txtcp_d = $_POST['txtcp_d'] ?? "";
    $txtctra_d = $_POST['txtctra_d'] ?? "";
    $txtKm_d = $_POST['txtKm_d'] ?? "";
    $txtdesc_d = $_POST['txtdesc_d'] ?? "";
    //$txtduracion = $_POST['txtduracion'] ?? "";
    $txthorario_in = $_POST['txthorario_in'] ?? "";
    $txthorario_fin = $_POST['txthorario_fin'] ?? "";
    $txtkms = $_POST['txtkms'] ?? "";
    $txttipo_veh = $_POST['txttipo_veh'] ?? "";
    $txtfecha = $_POST['txtfecha'] ?? "";
    $txtno_aut = $_POST['txtno_aut'] ?? "";
    $txtcaducidad = $_POST['txtcaducidad'] ?? "";
    $txtcd = $_POST['txtcd'] ?? "";
    $accion = $_POST['accion'] ?? "";

    // Ver los datos recibidos (para depuración)
    // echo "<pre>"; print_r($_POST); echo "</pre>";

    // Validación de datos (por ejemplo, vacíos)
    if (empty($txtcalle_o)) { $txtcalle_o = NULL; }
    if (empty($txtcalle_d)) { $txtcalle_d = NULL; }
    if (empty($txtnumero_o)) { $txtnumero_o = NULL; }
    if (empty($txtnumero_d)) { $txtnumero_d = NULL; }
    if (empty($txtcol_o)) { $txtcol_o = NULL; }
    if (empty($txtcol_d)) { $txtcol_d = NULL; }
    if (empty($txtcp_o)) { $txtcp_o = NULL; }
    if (empty($txtcp_d)) { $txtcp_d = NULL; }
    if (empty($txtctra_o)) { $txtctra_o = NULL; }
    if (empty($txtctra_d)) { $txtctra_d = NULL; }
    if (empty($txtKm_o)) { $txtKm_o = NULL; }
    if (empty($txtKm_d)) { $txtKm_d = NULL; }
    if (empty($txtdesc_o)) { $txtdesc_o = NULL; }
    if (empty($txtdesc_d)) { $txtdesc_d = NULL; }

    switch ($accion) {
        case "Agregar":
            try {
                // Preparar la consulta SQL
                $sentenciaSQL = $conexion->prepare("
                    INSERT INTO `rutas turisticas`
                    (ruta, ID_parada, punto_conocido_o, lat_o, long_o, cd_o, loc_o, calle_o, numero_o, col_o, cp_o, ctra_o, Km_o, desc_o,
                    punto_conocido_d, lat_d, long_d, cd_d, loc_d, calle_d, numero_d, col_d, cp_d, ctra_d, Km_d, desc_d,
                    horario_in, horario_fin, kms, tipo_veh, fecha, no_aut, caducidad)
                    VALUES
                    (:ruta, :ID_parada, :punto_conocido_o, :lat_o, :long_o, :cd_o, :loc_o, :calle_o, :numero_o, :col_o, :cp_o, :ctra_o, :Km_o, :desc_o,
                    :punto_conocido_d, :lat_d, :long_d, :cd_d, :loc_d, :calle_d, :numero_d, :col_d, :cp_d, :ctra_d, :Km_d, :desc_d,
                    :horario_in, :horario_fin, :kms, :tipo_veh, :fecha, :no_aut, :caducidad)");

                // Enlazar los parámetros de la consulta
                $sentenciaSQL->bindParam(':ruta', $txtruta);
                $sentenciaSQL->bindParam(':ID_parada', $txtID_parada);
                $sentenciaSQL->bindParam(':punto_conocido_o', $txtpunto_conocido_o);
                $sentenciaSQL->bindParam(':lat_o', $txtlat_o);
                $sentenciaSQL->bindParam(':long_o', $txtlong_o);
                $sentenciaSQL->bindParam(':cd_o', $txtcd_o);
                $sentenciaSQL->bindParam(':loc_o', $txtloc_o);
                $sentenciaSQL->bindParam(':calle_o', $txtcalle_o);
                $sentenciaSQL->bindParam(':numero_o', $txtnumero_o);
                $sentenciaSQL->bindParam(':col_o', $txtcol_o);
                $sentenciaSQL->bindParam(':cp_o', $txtcp_o);
                $sentenciaSQL->bindParam(':ctra_o', $txtctra_o);
                $sentenciaSQL->bindParam(':Km_o', $txtKm_o);
                $sentenciaSQL->bindParam(':desc_o', $txtdesc_o);
                $sentenciaSQL->bindParam(':punto_conocido_d', $txtpunto_conocido_d);
                $sentenciaSQL->bindParam(':lat_d', $txtlat_d);
                $sentenciaSQL->bindParam(':long_d', $txtlong_d);
                $sentenciaSQL->bindParam(':cd_d', $txtcd_d);
                $sentenciaSQL->bindParam(':loc_d', $txtloc_d);
                $sentenciaSQL->bindParam(':calle_d', $txtcalle_d);
                $sentenciaSQL->bindParam(':numero_d', $txtnumero_d);
                $sentenciaSQL->bindParam(':col_d', $txtcol_d);
                $sentenciaSQL->bindParam(':cp_d', $txtcp_d);
                $sentenciaSQL->bindParam(':ctra_d', $txtctra_d);
                $sentenciaSQL->bindParam(':Km_d', $txtKm_d);
                $sentenciaSQL->bindParam(':desc_d', $txtdesc_d);
                $sentenciaSQL->bindParam(':horario_in', $txthorario_in);
                $sentenciaSQL->bindParam(':horario_fin', $txthorario_fin);
                $sentenciaSQL->bindParam(':kms', $txtkms);
                $sentenciaSQL->bindParam(':tipo_veh', $txttipo_veh);
                $sentenciaSQL->bindParam(':fecha', $txtfecha);
                $sentenciaSQL->bindParam(':no_aut', $txtno_aut);
                $sentenciaSQL->bindParam(':caducidad', $txtcaducidad);
                //$sentenciaSQL->bindParam(':cd', $txtcd);

                // Ejecutar la consulta
                if ($sentenciaSQL->execute()) {
                    echo "<script>alert('✅ Parada agregada correctamente a la ruta: " . htmlspecialchars($txtruta, ENT_QUOTES, 'UTF-8') . "');</script>";
                } else {
                    echo "<script>alert('❌ Error al insertar el registro');</script>";
                }
            } catch (PDOException $e) {
                echo "❌ Error en la inserción: " . $e->getMessage();
            }
            break;

        case "Modificar":
            // Lógica de modificación aquí...
            break;

        case "Cancelar":
            echo "Presionado botón Cancelar";
            break;

        case "Borrar":
            // Borrar el registro basado en el ID
            $sentenciaSQL = $conexion->prepare("DELETE FROM `rutas turisticas` WHERE id = :id");
            $sentenciaSQL->bindParam(':id', $txtID);
            if ($sentenciaSQL->execute()) {
                echo "Registro eliminado.";
            }
            break;
    }
}
?>




<div class="container">

<h2 class="text-center text-primary mb-4 border-bottom pb-2">Registro de Parada</h2>



<form method="POST" enctype="multipart/form-data">

<div class="row align-items-end">
    <div class="col-md-6 d-flex align-items-center">
        <label for="txtID_parada" class="me-2">Parada Origen:</label>
        <input type="number" class="form-control w-50" name="txtID_parada" id="txtID_parada" value="1" min="1">
    </div>

    <div class="col-md-6 d-flex align-items-center">
    <label for="txtruta" class="me-2">Nombre de la Ruta:</label>
    <select class="form-control w-75" name="txtruta" id="txtruta">
        <option value="" disabled selected>Selecciona una ruta</option>
        <?php foreach ($rutas as $ruta): ?>
            <option value="<?= htmlspecialchars($ruta['ruta'], ENT_QUOTES, 'UTF-8') ?>">
                <?= htmlspecialchars($ruta['ruta'], ENT_QUOTES, 'UTF-8') ?>
            </option>
        <?php endforeach; ?>
    </select>
</div>

</div>

<br>

<div class="row">
            <!-- Columna de la mitad de la página (hasta Duración) -->
            <div class="col-md-6">
            <div class="card">
                <div class="card-header text-white bg-primary">
                    <h5 class="mb-0">Origen</h5>
                </div>
                <div class="card-body">
                        <!-- Origen -->
                        <div class="row">
    <!-- Punto Conocido -->
    <div class="col-md-6">
        <div class="form-group">
            <label for="txtpunto_conocido_o">Punto Conocido:</label>
            <select class="form-control" name="txtpunto_conocido_o" id="txtpunto_conocido_o" onchange="mostrarCampos()">
                <option value="Domicilio" selected>Domicilio</option>
                <option value="Carretera">Carretera</option>
                <option value="Lugar">Lugar</option>
            </select>
        </div>
    </div>

    <!-- Latitud y Longitud en la otra mitad -->
    <div class="col-md-6">
        <div class="d-flex justify-content-between">
            <!-- Latitud -->
            <div class="form-group" style="width: 48%;">
                <label for="txtlat_o">Latitud (°):</label>
                <input type="number" class="form-control" name="txtlat_o" id="txtlat_o" 
                    step="any" placeholder="Ej: -90.123456" min="-90" max="90">
            </div>

            <!-- Longitud -->
            <div class="form-group" style="width: 48%;">
                <label for="txtlong_o">Longitud (°):</label>
                <input type="number" class="form-control" name="txtlong_o" id="txtlong_o" 
                    step="any" placeholder="Ej: -90.123456" min="-90" max="90">
            </div>
        </div>
    </div>

    <div class="row">
    <!-- Entidad Federativa -->
    <div class="col-md-6">
        <div class="form-group">
            <label for="txtcd_o">Entidad Federativa: </label>
            <select class="form-control" name="txtcd_o" id="txtcd_o">
                <option value="">Seleccione una Entidad Federativa</option>
                <option value="CDMX">Ciudad de México</option>
                <option value="Aguascalientes">Aguascalientes</option>
                <option value="BajaCalifornia">Baja California</option>
                <option value="BajaCaliforniaSur">Baja California Sur</option>
                <option value="Campeche">Campeche</option>
                <option value="Chihuahua">Chihuahua</option>
                <option value="Coahuila">Coahuila</option>
                <option value="Colima">Colima</option>
                <option value="Durango">Durango</option>
                <option value="Guanajuato">Guanajuato</option>
                <option value="Guerrero">Guerrero</option>
                <option value="Hidalgo">Hidalgo</option>
                <option value="Jalisco">Jalisco</option>
                <option value="Mexico">México</option>
                <option value="Michoacan">Michoacán</option>
                <option value="Morelos">Morelos</option>
                <option value="Nayarit">Nayarit</option>
                <option value="NuevoLeon">Nuevo León</option>
                <option value="Oaxaca">Oaxaca</option>
                <option value="Puebla">Puebla</option>
                <option value="Querétaro">Querétaro</option>
                <option value="QuintanaRoo">Quintana Roo</option>
                <option value="SanLuisPotosi">San Luis Potosí</option>
                <option value="Sinaloa">Sinaloa</option>
                <option value="Sonora">Sonora</option>
                <option value="Tabasco">Tabasco</option>
                <option value="Tamaulipas">Tamaulipas</option>
                <option value="Tlaxcala">Tlaxcala</option>
                <option value="Veracruz">Veracruz</option>
                <option value="Yucatan">Yucatán</option>
                <option value="Zacatecas">Zacatecas</option>
            </select>
        </div>
    </div>

    <!-- Localidad -->
    <div class="col-md-6">
        <div class="form-group">
            <label for="txtloc_o">Localidad:</label>
            <input type="text" class="form-control" name="txtloc_o" id="txtloc_o" placeholder="Ingrese la localidad">
        </div>
    </div>
</div>



</div>



                        <!-- Dirección (Domicilio) -->
                        <div id="grupo_domicilio" class="row">
                            <div class="col-md-3">
                                <div class="form-group">
                                    <label for="txtcalle_o">Calle:</label>
                                    <input type="text" class="form-control" name="txtcalle_o" id="txtcalle_o" placeholder="Calle Origen">
                                </div>
                            </div>
                            <div class="col-md-2">
                                <div class="form-group">
                                    <label for="txtnumero_o">No.:</label>
                                    <input type="number" class="form-control" name="txtnumero_o" id="txtnumero_o" placeholder="Número" min="1">
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label for="txtcol_o">Col.:</label>
                                    <input type="text" class="form-control" name="txtcol_o" id="txtcol_o" placeholder="Colonia Origen">
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="form-group">
                                    <label for="txtcp_o">C.P.:</label>
                                    <input type="number" class="form-control" name="txtcp_o" id="txtcp_o" placeholder="Código Postal" min="0120">
                                </div>
                            </div>
                        </div>

                        <!-- Carretera -->
                        <div id="grupo_carretera" class="row" style="display: none;">
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label for="txtctra_o">Carretera: </label>
                                    <input type="number" class="form-control" name="txtctra_o" id="txtctra_o" placeholder="Carretera" min="1">
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label for="txtKm_o">Km: </label>
                                    <input type="number" class="form-control" name="txtKm_o" id="txtKm_o" placeholder="Km" min="1">
                                </div>
                            </div>
                        </div>

                        <!-- Lugar -->
                        <div id="grupo_lugar" class="form-group" style="display: none;">
                            <label for="txtdesc_o">Descripción: </label>
                            <input type="text" class="form-control" name="txtdesc_o" id="txtdesc_o" placeholder="Descripción">
                        </div>

                        <script>
function mostrarCampos() {
    var seleccion = document.getElementById("txtpunto_conocido_o").value;

    // Ocultar todos los grupos
    document.getElementById("grupo_domicilio").style.display = "none";
    document.getElementById("grupo_carretera").style.display = "none";
    document.getElementById("grupo_lugar").style.display = "none";

    // Mostrar el grupo correspondiente
    if (seleccion === "Domicilio") {
        document.getElementById("grupo_domicilio").style.display = "flex";
    } else if (seleccion === "Carretera") {
        document.getElementById("grupo_carretera").style.display = "flex";
    } else if (seleccion === "Lugar") {
        document.getElementById("grupo_lugar").style.display = "block";
    }
}
</script>

                    
                </div>
            </div>


                        <!-- Campos de Duración, Horarios, etc. -->
<div class="card mt-4">
    <div class="card-header text-white bg-secondary">
        <h5 class="mb-0">Detalles del Viaje</h5>
    </div>
    <div class="card-body">
        <div class="row">

            <div class="col-md-4">
                <div class="form-group">
                    <label for="txtkms">Kilómetros: </label>
                    <input type="number" class="form-control" name="txtkms" id="txtkms" placeholder="Kilómetros" min="1">
                </div>
            </div>

            <div class="col-md-4">
    <div class="form-group">
        <label for="txttipo_veh">Tipo de Vehículo: </label>
        <select class="form-control" name="txttipo_veh" id="txttipo_veh">
            <option value="">Seleccione el tipo de vehículo</option>
            <option value="moto">Moto</option>
            <option value="sedan">Sedán</option>
            <option value="suv">SUV</option>
            <option value="camioneta">Camioneta</option>
            <option value="camion">Camión</option>
            <option value="trailer">Tráiler</option>
        </select>
    </div>
</div>


<div class="row">
            <div class="col-md-6">
                <div class="form-group">
                    <label for="txthorario_in">Horario de Inicio:</label>
                    <input type="time" class="form-control" name="txthorario_in" id="txthorario_in">
                </div>
            </div>
            <div class="col-md-6">
                <div class="form-group">
                    <label for="txthorario_fin">Horario de Fin:</label>
                    <input type="time" class="form-control" name="txthorario_fin" id="txthorario_fin">
                </div>
            </div>
        </div>

        </div>

        
    </div>
</div>
        </div>

        <!-- Columna de la mitad de la página (Destino, Duración, etc.) -->
        <div class="col-md-6">
            <div class="card">
                <div class="card-header text-white bg-success">
                    <h5 class="mb-0">Destino</h5>
                </div>
                <div class="card-body">
                    <!-- Destino -->
                    <div class="row">
    <!-- Punto Conocido -->
    <div class="col-md-6">
        <div class="form-group">
            <label for="txtpunto_conocido_d">Punto Conocido:</label>
            <select class="form-control" name="txtpunto_conocido_d" id="txtpunto_conocido_d" onchange="mostrarCamposDestino()">
                <option value="Domicilio" selected>Domicilio</option>
                <option value="Carretera">Carretera</option>
                <option value="Lugar">Lugar</option>
            </select>
        </div>
    </div>

    <!-- Latitud y Longitud en la otra mitad -->
    <div class="col-md-6">
        <div class="d-flex justify-content-between">
            <!-- Latitud -->
            <div class="form-group" style="width: 48%;">
                <label for="txtlat_d">Latitud (°):</label>
                <input type="number" class="form-control" name="txtlat_d" id="txtlat_d" 
                    step="any" placeholder="Ej: -90.123456" min="-90" max="90">
            </div>

            <!-- Longitud -->
            <div class="form-group" style="width: 48%;">
                <label for="txtlong_d">Longitud (°):</label>
                <input type="number" class="form-control" name="txtlong_d" id="txtlong_d" 
                    step="any" placeholder="Ej: -180.123456" min="-180" max="180">
            </div>
        </div>
    </div>
    <div class="row">
    <!-- Entidad Federativa -->
    <div class="col-md-6">
        <div class="form-group">
            <label for="txtcd_d">Entidad Federativa: </label>
            <select class="form-control" name="txtcd_d" id="txtcd_d">
                <option value="">Seleccione una Entidad Federativa</option>
                <option value="CDMX">Ciudad de México</option>
                <option value="Aguascalientes">Aguascalientes</option>
                <option value="BajaCalifornia">Baja California</option>
                <option value="BajaCaliforniaSur">Baja California Sur</option>
                <option value="Campeche">Campeche</option>
                <option value="Chihuahua">Chihuahua</option>
                <option value="Coahuila">Coahuila</option>
                <option value="Colima">Colima</option>
                <option value="Durango">Durango</option>
                <option value="Guanajuato">Guanajuato</option>
                <option value="Guerrero">Guerrero</option>
                <option value="Hidalgo">Hidalgo</option>
                <option value="Jalisco">Jalisco</option>
                <option value="Mexico">México</option>
                <option value="Michoacan">Michoacán</option>
                <option value="Morelos">Morelos</option>
                <option value="Nayarit">Nayarit</option>
                <option value="NuevoLeon">Nuevo León</option>
                <option value="Oaxaca">Oaxaca</option>
                <option value="Puebla">Puebla</option>
                <option value="Querétaro">Querétaro</option>
                <option value="QuintanaRoo">Quintana Roo</option>
                <option value="SanLuisPotosi">San Luis Potosí</option>
                <option value="Sinaloa">Sinaloa</option>
                <option value="Sonora">Sonora</option>
                <option value="Tabasco">Tabasco</option>
                <option value="Tamaulipas">Tamaulipas</option>
                <option value="Tlaxcala">Tlaxcala</option>
                <option value="Veracruz">Veracruz</option>
                <option value="Yucatan">Yucatán</option>
                <option value="Zacatecas">Zacatecas</option>
            </select>
        </div>
    </div>

    <!-- Localidad -->
    <div class="col-md-6">
        <div class="form-group">
            <label for="txtloc_d">Localidad:</label>
            <input type="text" class="form-control" name="txtloc_d" id="txtloc_d" placeholder="Ingrese la localidad">
        </div>
    </div>
</div>

</div>



                    <!-- Dirección (Domicilio) -->
                    <div id="grupo_domicilio_d" class="row">
                        <div class="col-md-3">
                            <div class="form-group">
                                <label for="txtcalle_d">Calle:</label>
                                <input type="text" class="form-control" name="txtcalle_d" id="txtcalle_d" placeholder="Calle Destino">
                            </div>
                        </div>
                        <div class="col-md-2">
                            <div class="form-group">
                                <label for="txtnumero_d">No.:</label>
                                <input type="number" class="form-control" name="txtnumero_d" id="txtnumero_d" placeholder="Número" min="1">
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="form-group">
                                <label for="txtcol_d">Col:</label>
                                <input type="text" class="form-control" name="txtcol_d" id="txtcol_d" placeholder="Colonia Destino">
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="form-group">
                                <label for="txtcp_d">CP:</label>
                                <input type="number" class="form-control" name="txtcp_d" id="txtcp_d" placeholder="Código Postal" min="0120">
                            </div>
                        </div>
                    </div>

                    <!-- Carretera -->
                    <div id="grupo_carretera_d" class="row" style="display: none;">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="txtctra_d">Carretera: </label>
                                <input type="number" class="form-control" name="txtctra_d" id="txtctra_d" placeholder="Carretera" min="1">
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="txtKm_d">Km: </label>
                                <input type="number" class="form-control" name="txtKm_d" id="txtKm_d" placeholder="Km" min="1">
                            </div>
                        </div>
                    </div>

                    <!-- Lugar -->
                    <div id="grupo_lugar_d" class="form-group" style="display: none;">
                        <label for="txtdesc_d">Descripción: </label>
                        <input type="text" class="form-control" name="txtdesc_d" id="txtdesc_d" placeholder="Descripción">
                    </div>

                    <script>
function mostrarCamposDestino() {
    var seleccion = document.getElementById("txtpunto_conocido_d").value;

    // Ocultar todos los grupos
    document.getElementById("grupo_domicilio_d").style.display = "none";
    document.getElementById("grupo_carretera_d").style.display = "none";
    document.getElementById("grupo_lugar_d").style.display = "none";

    // Mostrar el grupo correspondiente
    if (seleccion === "Domicilio") {
        document.getElementById("grupo_domicilio_d").style.display = "flex";
    } else if (seleccion === "Carretera") {
        document.getElementById("grupo_carretera_d").style.display = "flex";
    } else if (seleccion === "Lugar") {
        document.getElementById("grupo_lugar_d").style.display = "block";
    }
}
</script>

                </div>



                
            </div>






            <!-- Tarjeta de Licencia -->
            <div class="card mt-4">
    <div class="card-header text-white bg-primary">
        <h5 class="mb-0">Licencia</h5>
    </div>
    <div class="card-body">
        <div class="d-flex flex-nowrap mb-3">
            <div class="form-group me-4">
                <label for="txtno_aut">No. de Autorización:</label>
                <input type="number" class="form-control" name="txtno_aut" id="txtno_aut" placeholder="Número de Autorización" min="1">
            </div>

            <div class="form-group me-4">
                <label for="txtfecha">Fecha de Inicio:</label>
                <input type="date" class="form-control" name="txtfecha" id="txtfecha">
            </div>

            <div class="form-group">
                <label for="txtcaducidad">Fecha de Caducidad:</label>
                <input type="date" class="form-control" name="txtcaducidad" id="txtcaducidad">
            </div>
        </div>
    </div>
</div>




</br>
</br>
            <!-- Botones -->
            <div class="btn-group" role="group" aria-label="">
                <button type="submit" name="accion" value="Agregar" class="btn btn-success">Agregar</button>

            </div>

            </form>
        </div>
    </div>
</div>







<?php include('template/pie.php'); ?>
