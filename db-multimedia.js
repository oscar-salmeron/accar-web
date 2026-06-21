// ==========================================
// ACCAR - BASE DE DATOS MULTIMEDIA LOCAL
// ==========================================

const dbMultimedia = {
    // 1. Nuestro Señor Jesucristo
    "dios": [
        {
            titulo: "El Gran Milagro",
            imagen: "dios_gran_milagro.jpg",
            url: "https://dai.ly/x903ero",
            ano: "2011",
            sinopsis: "Una inspiradora historia que revela el significado espiritual y los misterios ocultos detrás de la celebración de la Santa Misa."
        },
        {
            titulo: "La Pasión de Cristo",
            imagen: "dios_pasion_cristo.jpg",
            url: "https://youtu.be/kZS7djxgnDw?si=yqXxmuO5vGF1skgT",
            ano: "2004",
            sinopsis: "Un retrato profundo y conmovedor de las últimas 12 horas en la vida de Jesús de Nazaret el día de su crucifixión en Jerusalén."
        },
        {
            titulo: "La Eucaristía (Fernando Casanova)",
            imagen: "dios_eucaristia_casanova.jpg",
            url: "https://youtu.be/yHwDvmMBts4?si=iL3GhGsd9ALk8akj",
            ano: "Doc",
            sinopsis: "Testimonio y explicación teológica sobre la presencia real de Cristo en la Eucaristía, a cargo del ex-pastor protestante Fernando Casanova."
        },
        {
            titulo: "La Pascua y la Eucaristía",
            imagen: "dios_pascua_judia.jpg",
            ano: "Doc",
            sinopsis: "Serie de explicaciones teológicas e históricas sobre la Pascua Judía, la Última Cena y la Eucaristía como sacrificio expiatorio, a cargo de Frank Morera.",
            playlist: [
                { titulo_parte: "¿Como era la Pascua Judía?", url: "https://dai.ly/x8z3fye" },
                { titulo_parte: "Qué Hizo Jesús en la Última Cena. Parte 1", url: "https://dai.ly/x8z3gnq" },
                { titulo_parte: "Qué Hizo Jesús en la Última Cena. Parte 2", url: "https://dai.ly/x8z3hvo" },
                { titulo_parte: "La Eucaristía Como Sacrificio Expiatorio. P1", url: "https://dai.ly/x8z3j7w" },
                { titulo_parte: "La Eucaristía Como Sacrificio Expiatorio. P2", url: "https://dai.ly/x8z3k3i" }
            ]
        },
        {
            titulo: "Jesús de Nazaret",
            imagen: "dios_jesus_nazaret.jpg",
            url: "https://www.dropbox.com/scl/fi/1pq8ky76036n4s0z5wrky/Jes-s-De-Nazareth-Pel-cula-Completa.mp4?rlkey=lh2j37m8o0r7kzkbn15eq74r5&st=oadf10ju&raw=1",
            ano: "1977",
            sinopsis: "Aclamada miniserie que narra la vida, muerte y resurrección de Jesucristo con gran fidelidad histórica y bíblica."
        },
        {
            titulo: "El Evangelio de San Juan",
            imagen: "dios_evangelio_juan.jpg",
            url: "https://youtu.be/dV3wOrzgtF8?si=hKuBA7bq9wxa5dSd",
            ano: "2003",
            sinopsis: "Adaptación cinematográfica exacta, palabra por palabra, del Evangelio según San Juan."
        },
        {
            titulo: "Marcelino Pan y Vino",
            imagen: "dios_marcelino.jpg",
            url: "https://dai.ly/x8zg4ig",
            ano: "1955",
            sinopsis: "Conmovedora historia de un niño huérfano criado por monjes franciscanos y su milagrosa amistad con Cristo crucificado."
        },
        {
            titulo: "Próximamente",
            imagen: "dios_proximamente.jpg",
            url: "https://www.dropbox.com/scl/fi/o2ucj2dj4wc2u6dc7lju5/Proximante-mas-pelicula-y-series.mp4?rlkey=k3pmu77fk8gml5zpbr34qp3wu&st=sslx54m6&raw=1",
            ano: "ACCAR",
            sinopsis: "Nuevas películas y documentales se añadirán pronto a esta sección doctrinal."
        }
    ],

    // 2. Santísima Virgen María
    "maria": [
        {
            titulo: "El Defensor de la Inmaculada",
            imagen: "maria_defensor_inmaculada.jpg",
            url: "https://dai.ly/x8z736e",
            ano: "Doc",
            sinopsis: "Documental sobre la defensa del dogma de la Inmaculada Concepción y la vida de San Maximiliano Kolbe."
        },
        {
            titulo: "Los Ojos de Santa María de Guadalupe",
            imagen: "maria_ojos_guadalupe.jpg",
            url: "https://dai.ly/x8z73ga",
            ano: "Doc",
            sinopsis: "Investigación profunda sobre el misterio oculto y los descubrimientos científicos en los ojos de la Virgen de Guadalupe."
        },
        {
            titulo: "Dios te Salve, María",
            imagen: "maria_dios_te_salve.jpg",
            url: "https://dai.ly/x8z72x0",
            ano: "Doc",
            sinopsis: "Reflexión espiritual sobre el papel de la Virgen María en el plan de la redención y la vida del católico."
        },
        {
            titulo: "El Milagro de Nuestra Señora de Lourdes",
            imagen: "maria_milagro_lourdes.jpg",
            url: "https://youtu.be/bV4oBnL96-k?si=b6L2heIJrwwa5HaG",
            ano: "Cine",
            sinopsis: "Historia de las apariciones de la Virgen María a Santa Bernadette Soubirous y la fuente milagrosa en Francia."
        },
        {
            titulo: "Misterios de la Tilma",
            imagen: "maria_misterios_tilma.jpg",
            url: "https://dai.ly/x903cqq",
            ano: "Doc",
            sinopsis: "Análisis histórico e iconográfico del sagrado manto de San Juan Diego."
        },
        {
            titulo: "El Santo Rosario en Latín",
            imagen: "santo_rosario.jpg",
            ano: "Oración",
            sinopsis: "Rezo solemne del Santo Rosario tradicional en latín, meditando los sagrados misterios de la vida de Cristo y de la Virgen María.",
            playlist: [
                { titulo_parte: "Misterios Gozosos", url: "https://youtu.be/OwsAz1XU9sM" },
                { titulo_parte: "Misterios Dolorosos", url: "https://youtu.be/eR4dMKE07jQ" },
                { titulo_parte: "Misterios Luminosos", url: "" },
                { titulo_parte: "Misterios Gloriosos", url: "https://youtu.be/_HeCg2UL1Cc" }
            ]
        },
        {
            titulo: "Reina de Reinas",
            imagen: "maria_reina_reinas.jpg",
            url: "https://dai.ly/x8z7284",
            ano: "Doc",
            sinopsis: "Recorrido por las principales advocaciones marianas y su trascendencia en la fe de la Iglesia."
        },
        {
            titulo: "La Canción de Bernadette",
            imagen: "maria_cancion_bernadette.jpg",
            url: "https://www.dropbox.com/scl/fi/9btugfafn2m8tq0r1sh45/Las-Apariciones-de-la-Virgen-de-Lourdes.mp4?rlkey=efzcn1kynsksn7z65ei3nnx63&st=uxabk91j&raw=1",
            ano: "1943",
            sinopsis: "Clásico cinematográfico galardonado que narra la humilde vida de Bernadette y las revelaciones en la gruta de Massabielle."
        },
        {
            titulo: "El Milagro de Nuestra Señora de Fátima",
            imagen: "maria_milagro_fatima.jpg",
            url: "https://youtu.be/3JuPZKyAZTs?si=FwB1uEaFY2XvM5V9",
            ano: "1952",
            sinopsis: "Relato de los tres pequeños pastores que presenciaron los mensajes y los milagros de la Virgen en Fátima en 1917."
        },
        {
            titulo: "Tierra de María",
            imagen: "maria_tierra_maria.jpg",
            url: "https://youtu.be/O0knQgOFy7c?si=FcBOZqG0cc-qXpRk",
            ano: "2013",
            sinopsis: "Un viaje de investigación que busca descubrir si las apariciones de la Virgen María y la fe de quienes creen en ella son una locura o una realidad."
        },
        {
            titulo: "Próximamente",
            imagen: "maria_proximamente.jpg",
            url: "https://www.dropbox.com/scl/fi/o2ucj2dj4wc2u6dc7lju5/Proximante-mas-pelicula-y-series.mp4?rlkey=k3pmu77fk8gml5zpbr34qp3wu&st=sslx54m6&raw=1",
            ano: "ACCAR",
            sinopsis: "Nuevas películas y documentales marianos se añadirán pronto a esta sección doctrinal."
        }
    ],



    // 3. Vida de los Santos
    "santos": [
        { titulo: "San Antonio de Padua", imagen: "santos_antonio_padua.jpg", url: "https://dai.ly/x905s1c", ano: "", sinopsis: "" },
        { titulo: "San Policarpo", imagen: "santos_policarpo.jpg", url: "https://dai.ly/x8zjqdw", ano: "", sinopsis: "" },
        { titulo: "Padre Pío: Miracle Man", imagen: "santos_padre_pio.jpg", url: "https://youtu.be/RVIhI5fWKe4?si=zorALxXVioeB0mR9", ano: "", sinopsis: "" },
        { titulo: "La Cristiada", imagen: "santos_cristiada.jpg", url: "https://www.dropbox.com/scl/fi/ybsozdheer26wbw2l1nwf/CRISTIADA-Guerra-De-Los-Cristeros-Pelicula-Cat-lica.mp4?rlkey=6r5kcsyuo1i9yyogpegx0p7wn&st=0akbtqlx&raw=1", ano: "", sinopsis: "" },
        { titulo: "El Primado de Polonia", imagen: "santos_primado_polonia.jpg", url: "https://youtu.be/U7rT0jlREGs?si=dU_C_xqeU2tCLwzV", ano: "", sinopsis: "" },
        { titulo: "El Amor de los Amores", imagen: "santos_amor_amores.jpg", url: "https://dai.ly/x8z72ke", ano: "", sinopsis: "" },
        { titulo: "Mártir de la Pureza (Santa María Goretti)", imagen: "santos_maria_goretti.jpg", url: "https://dai.ly/x926toe", ano: "", sinopsis: "" },
        { titulo: "San Patricio", imagen: "santos_patricio.jpg", url: "https://dai.ly/x926vt4", ano: "", sinopsis: "" },
        { titulo: "Santa Francisca Javier Cabrini", imagen: "santos_cabrini.jpg", url: "https://dai.ly/x8zhu6a", ano: "", sinopsis: "" },
        { titulo: "Hermana Clare Crockett", imagen: "santos_clare_crockett.jpg", url: "https://dai.ly/x8zhips", ano: "", sinopsis: "" },
        { titulo: "El Secreto de Teresa", imagen: "santos_teresa_lisieux.jpg", url: "https://dai.ly/x8z73n2", ano: "", sinopsis: "" },
        { titulo: "Cántico de Magdalena", imagen: "santos_cantico_magdalena.jpg", url: "https://dai.ly/x903dh0", ano: "", sinopsis: "" },
        { titulo: "San Francisco de Asís", imagen: "santos_francisco_asis.jpg", url: "https://dai.ly/x8zjpqo", ano: "", sinopsis: "" },
        { titulo: "San José de Cupertino", imagen: "santos_jose_cupertino.jpg", url: "https://dai.ly/x8zjpf4", ano: "", sinopsis: "" },
        { titulo: "San Isidro Labrador", imagen: "santos_isidro_labrador.jpg", url: "https://dai.ly/x8zjris", ano: "", sinopsis: "" },
        { titulo: "San Ignacio de Loyola", imagen: "santos_ignacio_loyola.jpg", url: "https://youtu.be/WTRDQanmVJE?si=yUoFmu5kWpjVdsFx", ano: "", sinopsis: "" },
        { titulo: "Don Bosco", imagen: "santos_don_bosco.jpg", url: "https://youtu.be/c2BerCzDOOU?si=-PPBhhBnPsUuxmQ2", ano: "", sinopsis: "" },
        { titulo: "Bakhita", imagen: "santos_bakhita.jpg", url: "https://youtu.be/nD7Wuws4mBM?si=KXbJH9TUv5TxOa34", ano: "", sinopsis: "" },
        { titulo: "Clara y Francisco", imagen: "santos_clara_francisco.jpg", url: "https://youtu.be/L6jd4DpLzs0?si=SpoWpuNj59vRg2KS", ano: "", sinopsis: "" },
        { titulo: "Próximamente", imagen: "santos_proximamente.jpg", url: "https://www.dropbox.com/scl/fi/o2ucj2dj4wc2u6dc7lju5/Proximante-mas-pelicula-y-series.mp4?rlkey=k3pmu77fk8gml5zpbr34qp3wu&st=sslx54m6&raw=1", ano: "ACCAR", sinopsis: "Nuevas películas se añadirán pronto a esta sección." }
    ],

    // 4. Iglesia, Fe y Vocación
    "iglesia": [
        { titulo: "Las llaves del reino", imagen: "iglesia_llaves_reino.jpg", url: "https://youtu.be/0llfIXgt4Yk?si=bdBndauOhb8JBNpe", ano: "", sinopsis: "" },
        { titulo: "Un trozo de pan", imagen: "iglesia_trozo_pan.jpg", url: "https://dai.ly/x928z9u", ano: "", sinopsis: "" },
        { titulo: "La Fe (1947)", imagen: "iglesia_la_fe.jpg", url: "https://dai.ly/x926vt4", ano: "", sinopsis: "" },
        { titulo: "Dolor, luto y muerte", imagen: "iglesia_dolor_luto_muerte.jpg", url: "https://youtu.be/a5LnZsof2hA?si=VKJnyeP_hYRwSC3h", ano: "", sinopsis: "" },
        { titulo: "El género es inmutable", imagen: "iglesia_genero_inmutable.jpg", url: "https://youtu.be/A6mn9hCneXQ?si=bF5XaURXYLAjim6b", ano: "", sinopsis: "" },
        { titulo: "La Misión", imagen: "iglesia_la_mision.jpg", url: "https://youtu.be/T6MVx82pHvc?si=612dDEOs2rPlmYZR", ano: "", sinopsis: "" },
        { titulo: "Un hombre para la eternidad", imagen: "iglesia_hombre_eternidad.jpg", url: "https://youtu.be/Wi11JfrqkX8?si=GGmd93f5eOZanwbN", ano: "", sinopsis: "" },
        { titulo: "Diálogo de Carmelitas", imagen: "iglesia_dialogo_carmelitas.jpg", url: "https://youtu.be/27cXOozvgCQ?si=H6e9i2FPPn9GOqKf", ano: "", sinopsis: "" },
        { titulo: "Próximamente", imagen: "iglesia_proximamente.jpg", url: "https://www.dropbox.com/scl/fi/o2ucj2dj4wc2u6dc7lju5/Proximante-mas-pelicula-y-series.mp4?rlkey=k3pmu77fk8gml5zpbr34qp3wu&st=sslx54m6&raw=1", ano: "ACCAR", sinopsis: "Nuevas películas se añadirán pronto a esta sección." }
    ],

    // 5. Personajes de la Biblia
    "biblia": [
        { titulo: "La Historia de Ruth", imagen: "biblia_historia_ruth.jpg", url: "https://youtu.be/CuR14e8Gu7Y?si=h70Q3lxA9nZaNrUe", ano: "", sinopsis: "" },
        { titulo: "El Apóstol Pedro", imagen: "biblia_apostol_pedro.jpg", url: "https://dai.ly/x92it7s", ano: "", sinopsis: "" },
        { titulo: "San Juan Bautista", imagen: "biblia_juan_bautista.jpg", url: "https://dai.ly/x9038n8", ano: "", sinopsis: "" },
        { titulo: "Saúl y David", imagen: "biblia_saul_david.jpg", url: "https://dai.ly/x90i4p2", ano: "", sinopsis: "" },
        {
            titulo: "Los Diez Mandamientos",
            imagen: "biblia_diez_mandamientos.jpg",
            url: "https://www.dropbox.com/scl/fi/vf9zd6tzl9pox1pguuojx/Los-Diez-Mandamientos-1956.mp4?rlkey=ug2xfinizmmz4bds8lopathzj&st=f8zbarzy&raw=1",
            ano: "1956",
            sinopsis: "Drama bíblico ambientado en el Antiguo Egipto que narra la historia de Moisés (Charlton Heston), favorito de la familia del faraón, que decide renunciar a su vida de privilegios para conducir a su pueblo, los hebreos esclavizados en Egipto, hacia la libertad."
        },
        { titulo: "Abraham", imagen: "biblia_abraham.jpg", url: "https://youtu.be/gAAOOT44tes?si=3qOCCiz1Kznoq7Fo", ano: "", sinopsis: "" },
        { titulo: "Pablo, Apóstol de Cristo", imagen: "biblia_pablo_apostol.jpg", url: "https://ok.ru/video/631021046463", ano: "", sinopsis: "" },
        { titulo: "Ester", imagen: "biblia_ester.jpg", url: "https://youtu.be/R4tu1OYN_Nw?si=tnjuYf0DfedWJoBU", ano: "", sinopsis: "La reina que Dios eligió para salvar a su pueblo, la joven Ester, una humilde huérfana judía criada por su primo Mardoqueo, es llevada al palacio del rey Asuero para convertirse en candidata a reina del Imperio Persa." },
        { titulo: "Próximamente", imagen: "biblia_proximamente.jpg", url: "https://www.dropbox.com/scl/fi/o2ucj2dj4wc2u6dc7lju5/Proximante-mas-pelicula-y-series.mp4?rlkey=k3pmu77fk8gml5zpbr34qp3wu&st=sslx54m6&raw=1", ano: "ACCAR", sinopsis: "Nuevas películas se añadirán pronto a esta sección." }
    ],

    // 6. Series y Documentales
    "documentales": [
        { titulo: "El Santo Sudario (Oviedo)", imagen: "doc_santo_sudario_oviedo.jpg", url: "https://youtu.be/Yt3qD6R50xs?si=Vcizn1GV8GlUTM8o", ano: "", sinopsis: "" },
        { titulo: "La Sábana Santa (Veredicto Ciencia)", imagen: "doc_sabana_santa_ciencia.jpg", url: "https://youtu.be/tekrDnRPakE?si=aTCvc0Is_m85KK_z", ano: "", sinopsis: "" },
        { titulo: "Sábana Santa y el Sudario: Una perspectiva histórica", imagen: "doc_perspectiva_historica.jpg", url: "https://youtu.be/P2AoRkRa4zY?si=EEasN8RchNBZn3Nd", ano: "", sinopsis: "" },
        { titulo: "Estudio Artístico-Anatómico", imagen: "doc_estudio_anatomico.jpg", url: "https://youtu.be/xVTPZJ89oE4?si=oJuJ3-4_gQbQPBZG", ano: "", sinopsis: "" },
        { titulo: "Análisis Forense de las Coincidencias", imagen: "doc_analisis_forense.jpg", url: "https://youtu.be/TWvjPr7UY6c?si=UKvBJn4qPG1320sX", ano: "", sinopsis: "" },
        { titulo: "Jesús de Nazaret: Una Contextualización Histórica", imagen: "doc_jesus_contextualizacion.jpg", url: "https://youtu.be/TWOPiBLYN-Y?si=tEn3_B1d7x-iGGbF", ano: "", sinopsis: "" },
        { titulo: "Investigación Médica de la Muerte de Jesús", imagen: "doc_investigacion_medica.jpg", url: "https://youtu.be/1p92QV9yLio?si=CEuzIqOzGOertmve", ano: "", sinopsis: "" },
        { titulo: "Próximamente", imagen: "series_proximamente.jpg", url: "", ano: "ACCAR", sinopsis: "Nuevos documentales se añadirán pronto a esta sección." }
    ],

    // 7. Sucesores de Pedro (Papas)
    "papas": [
        { titulo: "Habemus Papam Francisco", imagen: "papas_habemus_francisco.jpg", url: "https://youtu.be/MvT65xd-_qo", ano: "", sinopsis: "" },
        { titulo: "Un Papa entre la gente", imagen: "papas_papa_entre_gente.jpg", url: "https://www.dropbox.com/scl/fi/fxefnwoaykin8i5fzp2a3/SS-FRANCISCO-UN-PAPA-ENTRE-LA-GENTE.mp4?rlkey=x01k5vg6oolnd4aaan8idl1g5&st=r3qmeouh&raw=1", ano: "", sinopsis: "El 13 de marzo de 2013 los cardenales sorprendieron al mundo con la elección de Francisco, el primer Papa latinoamericano. ¿Qué vieron en él?, ¿quién es Jorge Mario Bergoglio?, ¿por qué fueron hasta el fin del mundo para escoger un Papa?. " },
        { titulo: "Liderazgo del Papa Francisco", imagen: "papas_liderazgo_francisco.jpg", url: "https://youtu.be/A8Pc5NnCi8I", ano: "", sinopsis: "" },
        { titulo: "La Iglesia del Papa Francisco", imagen: "papas_iglesia_francisco.jpg", url: "https://youtu.be/k_gEtBg1Zwo", ano: "", sinopsis: "" },
        { titulo: "El Pacto de Amor: Matrimonio", imagen: "papas_pacto_amor.jpg", url: "https://youtu.be/3CprlpH0Ts4?si=zdz_yvzHLlCXS6WZ", ano: "", sinopsis: "" },
        { titulo: "Papa Francisco: El Papa de Todos", imagen: "papas_papa_de_todos.jpg", url: "https://youtu.be/x9KtGo3gxlA", ano: "", sinopsis: "" },
        { titulo: "Francisco, visto por sí mismo", imagen: "papas_francisco_si_mismo.jpg", url: "https://dai.ly/x9iitva", ano: "", sinopsis: "" },
        { titulo: "Exequias Papa Francisco", imagen: "papas_exequias_francisco.jpg", url: "https://youtu.be/P7STinAfv2c?si=vrkWYXPreHi30g1h", ano: "", sinopsis: "" },
        { titulo: "Habemus Papam Benedicto XVI", imagen: "papas_habemus_benedicto.jpg", url: "https://youtu.be/BZ3Hk9Rrs94", ano: "", sinopsis: "" },
        { titulo: "Benedicto XVI: En honor a la verdad", imagen: "papas_benedicto_verdad.jpg", url: "https://www.dropbox.com/scl/fi/3tybff8ht42knkd0aiw9l/Benedicto-Xvi-En-Honor-A-La-Verdad-Documental.mp4?rlkey=o8m3gpvhxm9el55zc2ad6fp1c&st=eo0g871w&raw=1", ano: "", sinopsis: "La cinta recorre los episodios más importantes de la vida de Joseph Ratzinger, desde su infancia en la Alemania nazi y su labor como teólogo, hasta su etapa al frente del pontificado. El núcleo central del documental se enfoca en desentrañar los motivos reales detrás de su dimisión." },
        { titulo: "Benedicto XVI: Colaborador de la verdad", imagen: "papas_profeta_tiempo.jpg", url: "https://youtu.be/JaQkOKNVO1M?si=t35IssDDpBc9l51q", ano: "", sinopsis: "" },
        { titulo: "Exequias Papa Benedicto XVI", imagen: "papas_exequias_benedicto.jpg", url: "https://youtu.be/BZ3Hk9Rrs94?si=6w3tK-PBAtgy1rjF", ano: "", sinopsis: "" },
        { titulo: "Habemus Papam Juan Pablo II", imagen: "papas_habemus_jp2.jpg", url: "https://youtu.be/9a--DpBeBIM?si=UPAPYuBUutOPS957", ano: "", sinopsis: "" },
        { titulo: "El Milagro de San Juan Pablo II", imagen: "papas_milagro_jp2.jpg", url: "https://youtu.be/bLCu09Iu0HQ", ano: "", sinopsis: "" },
        { titulo: "La Sonrisa de Juan Pablo II", imagen: "papas_sonrisa_jp2.jpg", url: "https://youtu.be/hqv2-dJyv3Y?si=QsT3s2CUOxmMIKpB", ano: "", sinopsis: "" },
        { titulo: "Juan Pablo II el hombre y su epoca", imagen: "papas_jp2_hombre_epoca.jpg", url: "https://youtu.be/EwfIrzNbzCU?si=-3lpvaV9EKRunNGg", ano: "", sinopsis: "" },
        { titulo: "Juan Pablo II documental completo en español", imagen: "papas_jp2_documental_completo.jpg", url: "https://youtu.be/wnacv6of4Ho?si=Vr84PV0HLOx4B6u0", ano: "", sinopsis: "" },
        { titulo: "Karol, el Papa, el Hombre", imagen: "papas_karol_papa_hombre.jpg", url: "https://youtu.be/NMwajooiCyY", ano: "", sinopsis: "" },
        { titulo: "Juan Pablo II, El Grande", imagen: "papas_jp2_el_grande.jpg", url: "https://youtu.be/y0HtkxxGtvg?si=rzZOsEMtMjeH81qy", ano: "", sinopsis: "" },
        { titulo: "Karol, el hombre que se convirtió en Papa", imagen: "papas_karol_hombre_papa.jpg", url: "https://youtu.be/S5v-905cW3Q", ano: "", sinopsis: "" },
        { titulo: "Próximamente", imagen: "papas_proximamente.jpg", url: "https://www.dropbox.com/scl/fi/o2ucj2dj4wc2u6dc7lju5/Proximante-mas-pelicula-y-series.mp4?rlkey=k3pmu77fk8gml5zpbr34qp3wu&st=sslx54m6&raw=1", ano: "ACCAR", sinopsis: "Nuevas películas se añadirán pronto a esta sección." }
    ],

    // 8. Catequesis Respuestas
    "catequesis": [
        { titulo: "LECCION # 1 QUE ES EL HOMBRE", imagen: "cat_01_que_es_el_hombre.jpg", url: "https://youtu.be/_EknbiWIIkY", ano: "", sinopsis: "" },
        { titulo: "LECCION # 2 QUE ES EL ALMA", imagen: "cat_02_que_es_el_alma.jpg", url: "https://youtu.be/fr6aVm4T7c0", ano: "", sinopsis: "" },
        { titulo: "LECCION # 3 DIFERENCIA EN SABER Y CREER", imagen: "cat_03_diferencia_saber_creer.jpg", url: "https://youtu.be/z_T9EMIwqOM", ano: "", sinopsis: "" },
        { titulo: "LECCION # 4 QUE SIGNIFICA CREER EN DIOS", imagen: "cat_04_creer_en_dios.jpg", url: "https://youtu.be/qewXXVpI_Ws", ano: "", sinopsis: "" },
        { titulo: "LECCION # 5 HAY PRUEBAS SOBRE LA EXISTENCIA DE DIOS", imagen: "cat_05_pruebas_existencia_dios.jpg", url: "https://youtu.be/HfvDWfgAdRg", ano: "", sinopsis: "" },
        { titulo: "LECCION # 6 QUE SON LOS MILAGROS", imagen: "cat_06_que_son_milagros.jpg", url: "https://youtu.be/xWMC1Cxm_1E", ano: "", sinopsis: "" },
        { titulo: "LECCION # 7 POR QUE DIOS SE REVELA ASI MISMO", imagen: "cat_07_dios_se_revela.jpg", url: "https://youtu.be/L9jdDIiSVYU", ano: "", sinopsis: "" },
        { titulo: "LECCION # 8 COMO SEA REVELADO DIOS", imagen: "cat_08_como_se_ha_revelado.jpg", url: "https://youtu.be/e5fOQ6cpfXg", ano: "", sinopsis: "" },
        { titulo: "LECCION # 9 COMO SE TRANSMITE LA REVELACION", imagen: "cat_09_como_transmite_revelacion.jpg", url: "https://youtu.be/-sW-jsjQR4Y", ano: "", sinopsis: "" },
        { titulo: "LECCION # 10 CUALES SON LAS PARTES DE LA BIBLIA", imagen: "cat_10_partes_de_la_biblia.jpg", url: "https://youtu.be/TymqUKUSiis", ano: "", sinopsis: "" },
        { titulo: "LECCION # 11 QUIEN DECIDIO QUE Y QUE NO ES PARTE DE LA BIBLIA", imagen: "cat_11_quien_decidio_biblia.jpg", url: "https://youtu.be/emx-NtzssAU", ano: "", sinopsis: "" },
        { titulo: "LECCION # 12 QUIEN ES DIOS", imagen: "cat_12_quien_es_dios.jpg", url: "https://youtu.be/02j-WAO5qyM", ano: "", sinopsis: "" },
        { titulo: "LECCION # 13 ES DIOS EN REALIDAD TODOPODEROSO", imagen: "cat_13_dios_todopoderoso.jpg", url: "https://youtu.be/G7yCZZmH15c", ano: "", sinopsis: "" },
        { titulo: "LECCION # 14 DIOS ES VERDADERAMENTE INMUTABLE", imagen: "cat_14_dios_inmutable.jpg", url: "https://youtu.be/A4rWxxRaK4k", ano: "", sinopsis: "" },
        { titulo: "LECCION # 15 ES DIOS UN HOMBRE DE BARBA LARGA", imagen: "cat_15_dios_barba_larga.jpg", url: "https://youtu.be/6d2tjiNXrgI", ano: "", sinopsis: "" },
        { titulo: "LECCION # 16 QUE SIGNIFICA QUE DIOS ES LA TRINIDAD", imagen: "cat_16_dios_es_trinidad.jpg", url: "https://youtu.be/8D-kofJFKLg", ano: "", sinopsis: "" },
        { titulo: "LECCION # 17 COMO PODEMOS RESUMIR LA CREENCIA EN LA SANTISIMA TRINIDAD", imagen: "cat_17_resumir_creencia_trinidad.jpg", url: "https://youtu.be/Tv5WjtTtme8", ano: "", sinopsis: "" },
        { titulo: "LECCION # 18 COMO PODEMOS ENTENDER A LA TRINIDAD", imagen: "cat_18_entender_la_trinidad.jpg", url: "https://youtu.be/35fnTBTOkdE", ano: "", sinopsis: "" },
        { titulo: "LECCION # 19 QUE IMAGENES TENEMOS DE LA SANTISIMA TRINIDAD", imagen: "cat_19_imagenes_de_trinidad.jpg", url: "https://youtu.be/9Z2MpYzFdSE", ano: "", sinopsis: "" },
        { titulo: "LECCION # 20 QUE SIGNIFICA QUE DIOS ES AMOR", imagen: "cat_20_dios_es_amor.jpg", url: "https://youtu.be/r_xeAZlHsnc", ano: "", sinopsis: "" },
        { titulo: "LECCION # 21 DE ACUERDO A LA IGLESIA QUE ES CREACION", imagen: "cat_21_que_es_creacion.jpg", url: "https://youtu.be/ZI3APYJqrmY", ano: "", sinopsis: "" },
        { titulo: "LECCION # 22 HAY ALGUNA CONTRADICCION ENTRE FE Y CIENCIA", imagen: "cat_22_contradiccion_fe_ciencia.jpg", url: "https://youtu.be/Du3Xylscp6Y", ano: "", sinopsis: "" },
        { titulo: "LECCION # 23 HAY ALGUNA CONTRADICCION EMTRE LA TEORIA DE LA CRECION DE LA BIBLIA Y LA CIENCIA", imagen: "cat_23_creacion_vs_ciencia.jpg", url: "https://youtu.be/31cHxJeNGIY", ano: "", sinopsis: "" },
        { titulo: "LECCION # 24 QUE ES EL MAL", imagen: "cat_24_que_es_el_mal.jpg", url: "https://youtu.be/S94dgs_s_vI", ano: "", sinopsis: "" },
        { titulo: "LECCION # 25 A QUE SE REFIEREN CON LA CAIDA DEL HOMBRE Y EL PECADO ORIGINAL", imagen: "cat_25_caida_pecado_original.jpg", url: "https://youtu.be/k1B8D4lczkM", ano: "", sinopsis: "" },
        { titulo: "LECCION # 26 EXISTE EL DIABLO", imagen: "cat_26_existe_el_diablo.jpg", url: "https://youtu.be/LXs5wqWOiew", ano: "", sinopsis: "" },
        { titulo: "LECCION # 27 QUIEN ERA JESUS", imagen: "cat_27_quien_era_jesus.jpg", url: "https://youtu.be/p4eHd-1SPmc", ano: "", sinopsis: "" },
        { titulo: "LECCION # 28 POR QUE DIOS SE HIZO HOMBRE", imagen: "cat_28_por_que_dios_hizo_hombre.jpg", url: "https://youtu.be/zvjwodRXjeo", ano: "", sinopsis: "" },
        { titulo: "LECCION # 29 POR QUE JESUS VINO AL MUNDO HACE 2000 AÑOS", imagen: "cat_29_por_que_jesus_vino.jpg", url: "https://youtu.be/tDsKosjgDH4", ano: "", sinopsis: "" },
        { titulo: "LECCION # 30 COMO VIVIO JESUS", imagen: "cat_30_como_vivio_jesus.jpg", url: "https://youtu.be/ZrjYE7-RR9s", ano: "", sinopsis: "" },
        { titulo: "LECCION # 31 COMO ES DIFERENTE JESUS DE LOS FUNDADORES DE OTRAS RELIGIONES", imagen: "cat_31_jesus_vs_fundadores.jpg", url: "https://youtu.be/RF1jqbwuDms", ano: "", sinopsis: "" },
        { titulo: "LECCION # 32 COMO FUE QUE JESUS NOS SALVO EN LA CRUZ", imagen: "cat_32_jesus_salvo_en_cruz.jpg", url: "https://youtu.be/6uEU9CZ2tkU", ano: "", sinopsis: "" },
        { titulo: "LECCION # 33 COMO ES QUE LA GRACIA DE LA SALVACION LLEGA A NOSOTROS", imagen: "cat_33_como_llega_gracia.jpg", url: "https://youtu.be/JF9qMGsr__A", ano: "", sinopsis: "" },
        { titulo: "LECCION # 34 QUE ES LA GRACIA", imagen: "cat_34_que_es_la_gracia.jpg", url: "https://youtu.be/4-KH2exYZzs", ano: "", sinopsis: "" },
        { titulo: "LECCION # 35 COMO RECIBIR UN AUMENTO DE GRACIA", imagen: "cat_35_como_recibir_gracia.jpg", url: "https://youtu.be/Y8hIrhDxZ_I", ano: "", sinopsis: "" },
        { titulo: "LECCION # 36 QUE ES EL BAUTISMO", imagen: "cat_36_que_es_bautismo.jpg", url: "https://youtu.be/B3qzh6n4kv4", ano: "", sinopsis: "" },
        { titulo: "LECCION # 37 QUE ES LA CONFIRMACION", imagen: "cat_37_que_es_confirmacion.jpg", url: "https://youtu.be/GFdcGui6xV4", ano: "", sinopsis: "" },
        { titulo: "LECCION # 38 QUE ES LA EUCARISTIA", imagen: "cat_38_que_es_eucaristia.jpg", url: "https://youtu.be/5FNbhAOZRUU", ano: "", sinopsis: "" },
        { titulo: "LECCION # 39 QUE ES LA SANTA MISA", imagen: "cat_39_que_es_santa_misa.jpg", url: "https://youtu.be/w8GO5MlK6og", ano: "", sinopsis: "" },
        { titulo: "LECCION # 40 CUALES SON LAS PARTES DE LA MISA", imagen: "cat_40_partes_de_misa.jpg", url: "https://youtu.be/vCwP8_RF-oI", ano: "", sinopsis: "" },
        { titulo: "LECCION # 41 QUE ES EL PECADO", imagen: "cat_41_que_es_pecado.jpg", url: "https://youtu.be/OfY7btBuYIk", ano: "", sinopsis: "" },
        { titulo: "LECCION # 42 QUE SON LOS 10 MANDAMIENTOS", imagen: "cat_42_los_10_mandamientos.jpg", url: "https://youtu.be/ntIe7ZbavRw", ano: "", sinopsis: "" },
        { titulo: "LECCION # 43 CUALES SON LOS 7 PECADOS CAPITALES", imagen: "cat_43_7_pecados_capitales.jpg", url: "https://youtu.be/JkWs5UWVi3U", ano: "", sinopsis: "" },
        { titulo: "LECCION # 44 QUE ES LA CONFESION", imagen: "cat_44_que_es_confesion.jpg", url: "https://youtu.be/f4l8Cd0fDrk", ano: "", sinopsis: "" },
        { titulo: "LECCION # 45 QUE ES LA UNCION DE LOS ENFERMOS", imagen: "cat_45_uncion_enfermos.jpg", url: "https://youtu.be/652Hfv5KjBM", ano: "", sinopsis: "" },
        { titulo: "LECCION # 46 QUE ES UN SACERDOTE CATOLICO", imagen: "cat_46_sacerdote_catolico.jpg", url: "https://youtu.be/2oK6GpsP7w4", ano: "", sinopsis: "" },
        { titulo: "LECCION # 47 CUALES SON LOS GRADOS DEL ORDEN SACERDOTAL", imagen: "cat_47_grados_orden_sacerdotal.jpg", url: "https://youtu.be/OVioWhNOJgY", ano: "", sinopsis: "" },
        { titulo: "LECCION # 48 QUE ES EL MATRIMONIO", imagen: "cat_48_que_es_matrimonio.jpg", url: "https://youtu.be/yxcQqpJWfTQ", ano: "", sinopsis: "" },
        { titulo: "LECCION # 49 QUE ES EL SEXO", imagen: "cat_49_que_es_sexo.jpg", url: "https://youtu.be/l_q2j9g98Ws", ano: "", sinopsis: "" },
        { titulo: "LECCION # 50 QUE ENSEÑA LA IGLESIA SOBRE LA MORALIDAD SEXUAL", imagen: "cat_50_ensenanza_moral_sexual.jpg", url: "https://youtu.be/68wZpWAM0uo", ano: "", sinopsis: "" },
        { titulo: "LECCION # 51 QUIEN ES EL ESPIRITU SANTO", imagen: "cat_51_quien_es_espiritu_santo.jpg", url: "https://youtu.be/L9PvFBaLkgA", ano: "", sinopsis: "" },
        { titulo: "LECCION # 52 QUE ES LA IGLESIA", imagen: "cat_52_que_es_la_iglesia.jpg", url: "https://youtu.be/kEmsRGJHTww", ano: "", sinopsis: "" },
        { titulo: "LECCION # 53 CUALES SON LAS 4 CARACTERISTICAS DE LA IGLESIA", imagen: "cat_53_4_caracteristicas_iglesia.jpg", url: "https://youtu.be/vbg-ImcPj74", ano: "", sinopsis: "" },
        { titulo: "LECCION # 54 POR QUE EXISTE LA IGLESIA", imagen: "cat_54_por_que_existe_iglesia.jpg", url: "https://youtu.be/qhGaepSrAkI", ano: "", sinopsis: "" },
        { titulo: "LECCION # 55 COMO SE COMPONE LA ESTRUCTURA DE LA IGLESIA", imagen: "cat_55_estructura_de_iglesia.jpg", url: "https://youtu.be/8wkBt6vSSH0", ano: "", sinopsis: "" },
        { titulo: "LECCION # 56 QUE SON LOS MONJES, MONJAS Y ORDENES RELIGIOSAS", imagen: "cat_56_monjes_monjas_ordenes.jpg", url: "https://youtu.be/tiIUewSkbCY", ano: "", sinopsis: "" },
        { titulo: "LECCION # 57 QUE Y CUANTOS", imagen: "cat_57_que_y_cuantos.jpg", url: "https://youtu.be/0DDT1w3G5Jc", ano: "", sinopsis: "" },
        { titulo: "LECCION # 58 CRITICAS CONTRA LA IGLESIA", imagen: "cat_58_criticas_contra_iglesia.jpg", url: "https://youtu.be/Dt7dExtbHXY", ano: "", sinopsis: "" },
        { titulo: "LECCION # 59 POR QUE LOS CATOLICOS NOS ENCOMENDAMOS A LOS SANTOS", imagen: "cat_59_encomendarnos_a_santos.jpg", url: "https://youtu.be/npd5xOgIjVM", ano: "", sinopsis: "" },
        { titulo: "LECCION # 60 QUIEN ES MARIA", imagen: "cat_60_quien_es_maria.jpg", url: "https://youtu.be/HMRaWXfNR7Q", ano: "", sinopsis: "" },
        { titulo: "LECCION # 61 QUE PASA AL FINAL DE NUESTRAS VIDAS", imagen: "cat_61_final_de_nuestras_vidas.jpg", url: "https://youtu.be/klsX-6On8Bk", ano: "", sinopsis: "" },
        { titulo: "LECCION # 62 QUE HAREMOS EN EL CIELO", imagen: "cat_62_que_haremos_en_cielo.jpg", url: "https://youtu.be/atEOCSGR4S0", ano: "", sinopsis: "" },
        { titulo: "LECCION # 63 QUE ES EL PURGATORIO", imagen: "cat_63_que_es_purgatorio.jpg", url: "https://youtu.be/k3q2GNDOSc4", ano: "", sinopsis: "" },
        { titulo: "LECCION # 64 QUE ES EL INFIERNO", imagen: "cat_64_que_es_infierno.jpg", url: "https://youtu.be/eprNfqcb2E4", ano: "", sinopsis: "" },
        { titulo: "LECCION # 65 QUE ES EL HOMBRE A LA LUZ DE LA FE", imagen: "cat_65_hombre_luz_de_fe.jpg", url: "https://youtu.be/olLGZfo17MI", ano: "", sinopsis: "" },
        { titulo: "LECCION # 66 ESTAN TODOS LLAMADOS A LA SANTIDAD", imagen: "cat_66_llamados_a_santidad.jpg", url: "https://youtu.be/V2Uiz79Vxck", ano: "", sinopsis: "" },
        { titulo: "LECCION # 67 QUE SON LAS VIRTUDES?", imagen: "cat_67_que_son_virtudes.jpg", url: "https://youtu.be/_ALGDpQQFXU", ano: "", sinopsis: "" },
        { titulo: "LECCION # 68 QUE ES LA ORACION?", imagen: "cat_68_que_es_la_oracion.jpg", url: "https://youtu.be/7-jfyrczzfY", ano: "", sinopsis: "" },
        { titulo: "LECCION # 69 CUAL ES EL PAPEL DEL CUERPO EN LA ORACION", imagen: "cat_69_papel_cuerpo_oracion.jpg", url: "https://youtu.be/gsAzjWSggOc", ano: "", sinopsis: "" },
        { titulo: "LECCION # 70 QUE ES EL PADRE NUESTRO", imagen: "cat_70_que_es_padre_nuestro.jpg", url: "https://youtu.be/uET_ok53VZs", ano: "", sinopsis: "" }
    ],

    // 9. Apologética Católica
    "apologetica": [
        { titulo: "Próximamente (Podcast / En Construcción)", imagen: "apologetica_proximamente.jpg", url: "", ano: "ACCAR", sinopsis: "Contenido en construcción." },
        { titulo: "Próximamente", imagen: "apologetica_proximamente.jpg", url: "", ano: "ACCAR", sinopsis: "Contenido en construcción." },
        { titulo: "Próximamente", imagen: "apologetica_proximamente.jpg", url: "https://www.dropbox.com/scl/fi/o2ucj2dj4wc2u6dc7lju5/Proximante-mas-pelicula-y-series.mp4?rlkey=k3pmu77fk8gml5zpbr34qp3wu&st=sslx54m6&raw=1", ano: "ACCAR", sinopsis: "Contenido en construcción." }
    ]
};
    
    // Aquí continuarás agregando el resto de las categorías (santos, iglesia, biblia, documentales, papas, apologetica)


// Diccionario para títulos formales en la interfaz
const titulosCategorias = {
    "dios": "Nuestro Señor Jesucristo",
    "maria": "Santísima Virgen María",
    "santos": "Vidas de Santos",
    "iglesia": "Historia de la Iglesia",
    "biblia": "Sagrada Escritura",
    "documentales": "Documentales y Series",
    "papas": "El Papado",
    "catequesis": "Catequesis de Formación",
    "apologetica": "Apologética Católica"
};