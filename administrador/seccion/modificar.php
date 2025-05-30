<?php 
include('template/cabecera.php');
include("../config/bd.php");

$conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$id = $_GET['id'] ?? null;

if ($id) {
    $sentenciaSQL = $conexion->prepare("SELECT * FROM `rutas turisticas` WHERE id = :id");
    $sentenciaSQL->bindParam(':id', $id, PDO::PARAM_INT);
    $sentenciaSQL->execute();
    $Ruta = $sentenciaSQL->fetch(PDO::FETCH_ASSOC);
}

if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['accion'])) {
    // Capturar datos del formulario
    $txtID = $_POST['txtID'] ?? null;
    $txtruta = $_POST['txtruta'] ?? "";
    $txtID_parada = $_POST['txtID_parada'] ?? "";
    $txtpunto_conocido_o = $_POST['txtpunto_conocido_o'] ?? "";
    $txtlat_o = $_POST['txtlat_o'] ?? "";
    $txtlong_o = $_POST['txtlong_o'] ?? "";
    $txtcd_o = $_POST['txtcd_o'] ?? "";
    $txtloc_o = $_POST['txtloc_o'] ?? "";

    // Asignar NULL si los campos no obligatorios están vacíos
    $txtcalle_o = empty($_POST['txtcalle_o']) ? null : $_POST['txtcalle_o'];
    $txtnumero_o = empty($_POST['txtnumero_o']) ? null : $_POST['txtnumero_o'];
    $txtcol_o = empty($_POST['txtcol_o']) ? null : $_POST['txtcol_o'];
    $txtcp_o = empty($_POST['txtcp_o']) ? null : $_POST['txtcp_o'];
    $txtctra_o = empty($_POST['txtctra_o']) ? null : $_POST['txtctra_o'];
    $txtKm_o = empty($_POST['txtKm_o']) ? null : $_POST['txtKm_o'];
    $txtdesc_o = empty($_POST['txtdesc_o']) ? null : $_POST['txtdesc_o'];

    $txtpunto_conocido_d = $_POST['txtpunto_conocido_d'] ?? "";
    $txtlat_d = $_POST['txtlat_d'] ?? "";
    $txtlong_d = $_POST['txtlong_d'] ?? "";
    $txtcd_d = $_POST['txtcd_d'] ?? "";
    $txtloc_d = $_POST['txtloc_d'] ?? "";

    // Asignar NULL si los campos no obligatorios están vacíos
    $txtcalle_d = empty($_POST['txtcalle_d']) ? null : $_POST['txtcalle_d'];
    $txtnumero_d = empty($_POST['txtnumero_d']) ? null : $_POST['txtnumero_d'];
    $txtcol_d = empty($_POST['txtcol_d']) ? null : $_POST['txtcol_d'];
    $txtcp_d = empty($_POST['txtcp_d']) ? null : $_POST['txtcp_d'];
    $txtctra_d = empty($_POST['txtctra_d']) ? null : $_POST['txtctra_d'];
    $txtKm_d = empty($_POST['txtKm_d']) ? null : $_POST['txtKm_d'];
    $txtdesc_d = empty($_POST['txtdesc_d']) ? null : $_POST['txtdesc_d'];

    $txthorario_in = $_POST['txthorario_in'] ?? "";
    $txthorario_fin = $_POST['txthorario_fin'] ?? "";
    $txtkms = $_POST['txtkms'] ?? "";
    $txttipo_veh = $_POST['txttipo_veh'] ?? "";
    $txtfecha = $_POST['txtfecha'] ?? "";
    $txtno_aut = $_POST['txtno_aut'] ?? "";
    $txtcaducidad = $_POST['txtcaducidad'] ?? "";

    $accion = $_POST['accion'] ?? "";

    if ($txtID && $txtpunto_conocido_o && $txtlat_o && $txtlong_o && $accion == 'Actualizar') {
        try {
            // Actualización de datos
            $sql = "UPDATE `rutas turisticas` SET
                    ruta = :ruta,
                    ID_parada = :ID_parada,
                    punto_conocido_o = :punto_conocido_o,
                    lat_o = :lat_o,
                    long_o = :long_o,
                    cd_o = :cd_o,
                    loc_o = :loc_o,
                    calle_o = :calle_o,
                    numero_o = :numero_o,
                    col_o = :col_o,
                    cp_o = :cp_o,
                    ctra_o = :ctra_o,
                    Km_o = :Km_o,
                    desc_o = :desc_o,
                    punto_conocido_d = :punto_conocido_d,
                    lat_d = :lat_d,
                    long_d = :long_d,
                    cd_d = :cd_d,
                    loc_d = :loc_d,
                    calle_d = :calle_d,
                    numero_d = :numero_d,
                    col_d = :col_d,
                    cp_d = :cp_d,
                    ctra_d = :ctra_d,
                    Km_d = :Km_d,
                    desc_d = :desc_d,
                    horario_in = :horario_in,
                    horario_fin = :horario_fin,
                    kms = :kms,
                    tipo_veh = :tipo_veh,
                    fecha = :fecha,
                    no_aut = :no_aut,
                    caducidad = :caducidad
                    WHERE id = :id";
                    
            $stmt = $conexion->prepare($sql);
            $stmt->bindParam(':id', $txtID, PDO::PARAM_INT);
            $stmt->bindParam(':ruta', $txtruta);
            $stmt->bindParam(':ID_parada', $txtID_parada);
            $stmt->bindParam(':punto_conocido_o', $txtpunto_conocido_o);
            $stmt->bindParam(':lat_o', $txtlat_o);
            $stmt->bindParam(':long_o', $txtlong_o);
            $stmt->bindParam(':cd_o', $txtcd_o);
            $stmt->bindParam(':loc_o', $txtloc_o);
            $stmt->bindParam(':calle_o', $txtcalle_o);
            $stmt->bindParam(':numero_o', $txtnumero_o);
            $stmt->bindParam(':col_o', $txtcol_o);
            $stmt->bindParam(':cp_o', $txtcp_o);
            $stmt->bindParam(':ctra_o', $txtctra_o);
            $stmt->bindParam(':Km_o', $txtKm_o);
            $stmt->bindParam(':desc_o', $txtdesc_o);
            $stmt->bindParam(':punto_conocido_d', $txtpunto_conocido_d);
            $stmt->bindParam(':lat_d', $txtlat_d);
            $stmt->bindParam(':long_d', $txtlong_d);
            $stmt->bindParam(':cd_d', $txtcd_d);
            $stmt->bindParam(':loc_d', $txtloc_d);
            $stmt->bindParam(':calle_d', $txtcalle_d);
            $stmt->bindParam(':numero_d', $txtnumero_d);
            $stmt->bindParam(':col_d', $txtcol_d);
            $stmt->bindParam(':cp_d', $txtcp_d);
            $stmt->bindParam(':ctra_d', $txtctra_d);
            $stmt->bindParam(':Km_d', $txtKm_d);
            $stmt->bindParam(':desc_d', $txtdesc_d);
            $stmt->bindParam(':horario_in', $txthorario_in);
            $stmt->bindParam(':horario_fin', $txthorario_fin);
            $stmt->bindParam(':kms', $txtkms);
            $stmt->bindParam(':tipo_veh', $txttipo_veh);
            $stmt->bindParam(':fecha', $txtfecha);
            $stmt->bindParam(':no_aut', $txtno_aut);
            $stmt->bindParam(':caducidad', $txtcaducidad);

            $stmt->execute();
            echo "<script>alert('✅ Datos actualizados exitosamente'); window.location.href = 'rutas.php';</script>";

        } catch (PDOException $e) {
            echo "<script>alert('❌ Error al actualizar: " . addslashes($e->getMessage()) . "');</script>";
        }
    }
}
?>





<div class="container">

<h2 class="text-center text-primary mb-4 border-bottom pb-2">Modificar </h2>



                    <form method="POST" enctype="multipart/form-data">

                    <input type="hidden" name="txtID" value="<?php echo $Ruta['id']; ?>">


                    
                    <div class="row align-items-end">
    <div class="col-md-6 d-flex align-items-center">
        <label for="txtID_parada" class="me-2"></label>
        <input type="hidden" class="form-control w-50" value="<?php echo $Ruta['ID_parada']; ?>" name="txtID_parada" id="txtID_parada" value="1" min="1">
    </div>

    <div class="col-md-6 d-flex align-items-center">
        <label for="txtruta" class="me-2">Nombre de la Ruta:</label>
        <input type="text" class="form-control w-75" value="<?php echo $Ruta['ruta']; ?>" name="txtruta" id="txtruta" placeholder="Nombre de la Ruta">
    </div>
</div>


</br>

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
            <select class="form-control" value="<?php echo $Ruta['punto_conocido_o']; ?>" name="txtpunto_conocido_o" id="txtpunto_conocido_o" onchange="mostrarCampos()">
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
                <input type="number" class="form-control" value="<?php echo $Ruta['long_o']; ?>" name="txtlong_o" id="txtlong_o" 
                    step="any" placeholder="Ej: -90.123456" min="-90" max="90">
            </div>
        </div>
    </div>

    <div class="row">
    <!-- Entidad Federativa -->
    <div class="col-md-6">
        <div class="form-group">
            <label for="txtcd_o">Entidad Federativa: </label>
            <select class="form-control" value="<?php echo $Ruta['cd_o']; ?>" name="txtcd_o" id="txtcd_o">
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
            <input type="text" class="form-control" value="<?php echo $Ruta['loc_o']; ?>" name="txtloc_o" id="txtloc_o" placeholder="Ingrese la localidad">
        </div>
    </div>
</div>



</div>



                        <!-- Dirección (Domicilio) -->
                        <div id="grupo_domicilio" class="row">
                            <div class="col-md-3">
                                <div class="form-group">
                                    <label for="txtcalle_o">Calle:</label>
                                    <input type="text" class="form-control" value="<?php echo $Ruta['calle_o']; ?>" name="txtcalle_o" id="txtcalle_o" placeholder="Calle Origen">
                                </div>
                            </div>
                            <div class="col-md-2">
                                <div class="form-group">
                                    <label for="txtnumero_o">No.:</label>
                                    <input type="number" class="form-control" value="<?php echo $Ruta['numero_o']; ?>" name="txtnumero_o" id="txtnumero_o" placeholder="Número" min="1">
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label for="txtcol_o">Col.:</label>
                                    <input type="text" class="form-control" value="<?php echo $Ruta['col_o']; ?>" name="txtcol_o" id="txtcol_o" placeholder="Colonia Origen">
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="form-group">
                                    <label for="txtcp_o">C.P.:</label>
                                    <input type="number" class="form-control" value="<?php echo $Ruta['cp_o']; ?>" name="txtcp_o" id="txtcp_o" placeholder="Código Postal" min="0120">
                                </div>
                            </div>
                        </div>

                        <!-- Carretera -->
                        <div id="grupo_carretera" class="row" style="display: none;">
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label for="txtctra_o">Carretera: </label>
                                    <input type="number" class="form-control" value="<?php echo $Ruta['ctra_o']; ?>" name="txtctra_o" id="txtctra_o" placeholder="Carretera" min="1">
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label for="txtKm_o">Km: </label>
                                    <input type="number" class="form-control" value="<?php echo $Ruta['Km_o']; ?>" name="txtKm_o" id="txtKm_o" placeholder="Km" min="1">
                                </div>
                            </div>
                        </div>

                        <!-- Lugar -->
                        <div id="grupo_lugar" class="form-group" style="display: none;">
                            <label for="txtdesc_o">Descripción: </label>
                            <input type="text" class="form-control" value="<?php echo $Ruta['desc_o']; ?>" name="txtdesc_o" id="txtdesc_o" placeholder="Descripción">
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
                    <input type="number" class="form-control" value="<?php echo $Ruta['kms']; ?>" name="txtkms" id="txtkms" placeholder="Kilómetros" min="1">
                </div>
            </div>

            <div class="col-md-4">
    <div class="form-group">
        <label for="txttipo_veh">Tipo de Vehículo: </label>
        <select class="form-control" value="<?php echo $Ruta['tipo_veh']; ?>" name="txttipo_veh" id="txttipo_veh">
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
                    <input type="time" class="form-control" value="<?php echo $Ruta['horario_in']; ?>" name="txthorario_in" id="txthorario_in">
                </div>
            </div>
            <div class="col-md-6">
                <div class="form-group">
                    <label for="txthorario_fin">Horario de Fin:</label>
                    <input type="time" class="form-control" value="<?php echo $Ruta['horario_fin']; ?>" name="txthorario_fin" id="txthorario_fin">
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
            <select class="form-control" value="<?php echo $Ruta['punto_conocido_d']; ?>" name="txtpunto_conocido_d" id="txtpunto_conocido_d" onchange="mostrarCamposDestino()">
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
                <input type="number" class="form-control" value="<?php echo $Ruta['lat_d']; ?>" name="txtlat_d" id="txtlat_d" 
                    step="any" placeholder="Ej: -90.123456" min="-90" max="90">
            </div>

            <!-- Longitud -->
            <div class="form-group" style="width: 48%;">
                <label for="txtlong_d">Longitud (°):</label>
                <input type="number" class="form-control" value="<?php echo $Ruta['long_d']; ?>" name="txtlong_d" id="txtlong_d" 
                    step="any" placeholder="Ej: -180.123456" min="-180" max="180">
            </div>
        </div>
    </div>
    <div class="row">
    <!-- Entidad Federativa -->
    <div class="col-md-6">
        <div class="form-group">
            <label for="txtcd_d">Entidad Federativa: </label>
            <select class="form-control" value="<?php echo $Ruta['cd_o']; ?>" name="txtcd_d" id="txtcd_d">
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
            <input type="text" class="form-control" value="<?php echo $Ruta['loc_o']; ?>" name="txtloc_d" id="txtloc_d" placeholder="Ingrese la localidad">
        </div>
    </div>
</div>

</div>



                    <!-- Dirección (Domicilio) -->
                    <div id="grupo_domicilio_d" class="row">
                        <div class="col-md-3">
                            <div class="form-group">
                                <label for="txtcalle_d">Calle:</label>
                                <input type="text" class="form-control" value="<?php echo $Ruta['calle_d']; ?>" name="txtcalle_d" id="txtcalle_d" placeholder="Calle Destino">
                            </div>
                        </div>
                        <div class="col-md-2">
                            <div class="form-group">
                                <label for="txtnumero_d">No.:</label>
                                <input type="number" class="form-control" value="<?php echo $Ruta['numero_d']; ?>" name="txtnumero_d" id="txtnumero_d" placeholder="Número" min="1">
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="form-group">
                                <label for="txtcol_d">Col:</label>
                                <input type="text" class="form-control" value="<?php echo $Ruta['col_d']; ?>" name="txtcol_d" id="txtcol_d" placeholder="Colonia Destino">
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="form-group">
                                <label for="txtcp_d">CP:</label>
                                <input type="number" class="form-control" value="<?php echo $Ruta['cp_d']; ?>" name="txtcp_d" id="txtcp_d" placeholder="Código Postal" min="0120">
                            </div>
                        </div>
                    </div>

                    <!-- Carretera -->
                    <div id="grupo_carretera_d" class="row" style="display: none;">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="txtctra_d">Carretera: </label>
                                <input type="number" class="form-control" value="<?php echo $Ruta['ctra_d']; ?>" name="txtctra_d" id="txtctra_d" placeholder="Carretera" min="1">
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="txtKm_d">Km: </label>
                                <input type="number" class="form-control"  value="<?php echo $Ruta['Km_d']; ?>" name="txtKm_d" id="txtKm_d" placeholder="Km" min="1">
                            </div>
                        </div>
                    </div>

                    <!-- Lugar -->
                    <div id="grupo_lugar_d" class="form-group" style="display: none;">
                        <label for="txtdesc_d">Descripción: </label>
                        <input type="text" class="form-control" value="<?php echo $Ruta['']; ?>" name="txtdesc_d" id="txtdesc_d" placeholder="Descripción">
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
<div class="btn-group" role="group" aria-label="">
                <button type="submit" name="accion" value="Actualizar" class="btn btn-success">Actualizar</button>
            </div>

            </form>
        </div>
    </div>
</div>







<?php include('template/pie.php'); ?>






