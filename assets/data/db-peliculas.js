// ==========================================
// ACCAR - BASE DE DATOS DE PELÍCULAS Y SERIES
// ==========================================

window.dbMultimedia = {
    // 1. Nuestro Señor Jesucristo
    "dios": [
        {
            titulo: "El Gran Milagro",
            imagen: "dios_gran_milagro.jpg",
            url: "https://drive.google.com/file/d/161mgc7H6twluV4DaMVKSzdQ-TsHEgRuU/view?usp=drive_link",
            ano: "2011",
            sinopsis: "Una inspiradora historia que revela el significado espiritual y los misterios ocultos detrás de la celebración de la Santa Misa."
        },
        {
            titulo: "La Pasión de Cristo",
            imagen: "dios_pasion_cristo.jpg",
            url: "https://drive.google.com/file/d/1LS42VLJYCzn1PsG1ccCBC7M70eh4Wq72/view?usp=drive_link",
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
                { titulo_parte: "¿Cómo era la Pascua Judía?", url: "https://drive.google.com/file/d/1GKFEhdx2cA4uqFg9ZxGWO4wrOrUYda87/view?usp=sharing" },
                { titulo_parte: "Qué Hizo Jesús en la Última Cena. Parte 1", url: "https://drive.google.com/file/d/1fAGAN2Nqvi4oDLnfep-R3BOpMgRVYaEi/view?usp=sharing" },
                { titulo_parte: "Qué Hizo Jesús en la Última Cena. Parte 2", url: "https://drive.google.com/file/d/11SiwlqA7MV08LtqC7ATQOYlwxWL4bBzN/view?usp=sharing" },
                { titulo_parte: "La Eucaristía Como Sacrificio Expiatorio. P1", url: "https://drive.google.com/file/d/1hTlM7bVAluW4zpFEKKTh9y8K1wyvAeJl/view?usp=sharing" },
                { titulo_parte: "La Eucaristía Como Sacrificio Expiatorio. P2", url: "https://drive.google.com/file/d/152X708g8_CZOo1kucV8Myi1XPMlkeiQl/view?usp=sharing" }
            ]
        },
        {
            titulo: "Jesús de Nazaret",
            imagen: "dios_jesus_nazaret.jpg",
            url: "https://drive.google.com/file/d/1I33IAKza_zVWZzkQjzORZ0GSVg7CVxvW/view?usp=drive_link",
            ano: "1977",
            sinopsis: "Aclamada producción que narra el nacimiento, ministerio público, pasión, muerte y resurrección de Jesucristo con gran fidelidad histórica y bíblica."
        },
        {
            titulo: "El Mártir del Calvario",
            imagen: "dios_martir_calvario.jpg",
            url: "https://drive.google.com/file/d/1DjbId6Vk_5OCNBVOgVNls1wbgBR713tZ/view?usp=drive_link",
            ano: "1952",
            sinopsis: "Clásico del cine religioso que recorre la vida pública de Nuestro Señor Jesucristo, sus milagros, sus enseñanzas y su entrega redentora en la cruz."
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
            url: "https://drive.google.com/file/d/1EOa3Kwe6kZzatH2r8_HD-nAfwCe4Vss8/view?usp=drive_link",
            ano: "1955",
            sinopsis: "Conmovedora historia de un niño huérfano criado por frailes franciscanos y su milagrosa amistad con Cristo crucificado."
        }
    ],

    // 2. Santa María Madre de Dios
    "maria": [
        {
            titulo: "Apariciones de la Virgen de Guadalupe",
            imagen: "maria_apariciones_guadalupe.jpg",
            url: "https://drive.google.com/file/d/1JWd9PNxn3njnDzpmBk0VFCZqTOfO6pRK/view?usp=drive_link",
            ano: "Cine",
            sinopsis: "Relato de las apariciones de Santa María de Guadalupe a San Juan Diego en el cerro del Tepeyac en 1531 y el milagro de su sagrada tilma."
        },
        {
            titulo: "Los Ojos de Santa María de Guadalupe",
            imagen: "maria_ojos_guadalupe.jpg",
            url: "https://drive.google.com/file/d/1P34M48qTpmRHEn0ezprJt7FeUWbMez3P/view?usp=drive_link",
            ano: "Doc",
            sinopsis: "Investigación profunda sobre el misterio oculto y los descubrimientos científicos en los ojos de la Virgen de Guadalupe."
        },
        {
            titulo: "El Defensor de la Inmaculada",
            imagen: "maria_defensor_inmaculada.jpg",
            url: "https://drive.google.com/file/d/13rPgREBnODFReTX1a8ZAq_8AGrgcM0n8/view?usp=drive_link",
            ano: "Doc",
            sinopsis: "Estudio histórico y teológico sobre el Beato Juan Duns Escoto y su brillante defensa del dogma de la Inmaculada Concepción de María."
        },
        {
            titulo: "Dios te Salve, María",
            imagen: "maria_dios_te_salve.jpg",
            url: "https://drive.google.com/file/d/1Xe9SxjFxqavPWoi8UC5jsG-n61D2eAQ9/view?usp=drive_link",
            ano: "Doc",
            sinopsis: "Reflexión espiritual sobre el papel de la Virgen María en el plan de la redención y en la vida cotidiana del católico."
        },
        {
            titulo: "El Milagro de Nuestra Señora de Lourdes",
            imagen: "maria_milagro_lourdes.jpg",
            url: "https://drive.google.com/file/d/15z7Xle9wUeyWEvFOd5R-2HjkZJuqFZWD/view?usp=drive_link",
            ano: "Cine",
            sinopsis: "Historia de las apariciones de la Virgen María a Santa Bernadette Soubirous y la fuente milagrosa en Francia."
        },
        {
            titulo: "Misterios de la Tilma",
            imagen: "maria_misterios_tilma.jpg",
            url: "https://drive.google.com/file/d/1lkg6fJKItVg9U583k6fu1HgdG3XnqRSB/view?usp=drive_link",
            ano: "Doc",
            sinopsis: "Análisis histórico, científico e iconográfico del sagrado ayate de San Juan Diego."
        },
        {
            titulo: "El Santo Rosario en Latín",
            imagen: "santo_rosario.jpg",
            ano: "Oración",
            sinopsis: "Rezo solemne del Santo Rosario tradicional en latín, meditando los sagrados misterios de la vida de Cristo y de la Virgen María.",
            playlist: [
                { titulo_parte: "Misterios Gozosos", url: "https://youtu.be/OwsAz1XU9sM" },
                { titulo_parte: "Misterios Dolorosos", url: "https://youtu.be/eR4dMKE07jQ" },
                { titulo_parte: "Misterios Gloriosos", url: "https://youtu.be/_HeCg2UL1Cc" }
            ]
        },
        {
            titulo: "Reina de Reinas",
            imagen: "maria_reina_reinas.jpg",
            url: "https://drive.google.com/file/d/19ATWj8yYh6quK7XQhGl8CRA9DeL1h3xR/view?usp=drive_link",
            ano: "1948",
            sinopsis: "Clásico cinematográfico dedicado a la vida, virtudes y maternidad espiritual de la Santísima Virgen María."
        },
        {
            titulo: "La Canción de Bernadette",
            imagen: "maria_cancion_bernadette.jpg",
            url: "https://drive.google.com/file/d/1uV5-69KeiiBINAqvsmPf92Q46yajQKux/view?usp=drive_link",
            ano: "1943",
            sinopsis: "Clásico galardonado que narra la humilde vida de Santa Bernadette y las revelaciones de la Inmaculada en la gruta de Massabielle."
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
            sinopsis: "Un viaje de investigación y testimonios reales que muestra cómo la fe en la Virgen María transforma corazones alrededor del mundo."
        }
    ],

    // 3. Vida de los Santos
    "santos": [
        {
            titulo: "San Antonio de Padua",
            imagen: "santos_antonio_padua.jpg",
            url: "https://drive.google.com/file/d/1VPKD0NclHnoPcu4xtm6ho7naBRdpMg3k/view?usp=drive_link",
            ano: "2002",
            sinopsis: "Biografía del célebre fraile franciscano y Doctor de la Iglesia, reconocido por su elocuencia, caridad con los pobres y numerosos milagros."
        },
        {
            titulo: "San Policarpo",
            imagen: "santos_policarpo.jpg",
            url: "https://drive.google.com/file/d/1pJ-ETcD9bSOcRbdTLs-ja9LE5fvwWPDR/view?usp=drive_link",
            ano: "2015",
            sinopsis: "Historia del obispo de Esmirna y discípulo del apóstol San Juan, quien dio testimonio inquebrantable de Cristo hasta el martirio."
        },
        {
            titulo: "Padre Pío: Miracle Man",
            imagen: "santos_padre_pio.jpg",
            url: "https://youtu.be/RVIhI5fWKe4?si=zorALxXVioeB0mR9",
            ano: "2000",
            sinopsis: "Retrato conmovedor de San Pío de Pietrelcina, el sacerdote capuchino marcado por los estigmas de Cristo y dedicado incansablemente al confesionario."
        },
        {
            titulo: "La Cristiada",
            imagen: "santos_cristiada.jpg",
            url: "https://drive.google.com/file/d/1rV_UK6pV4N80MN9TtRVr8cnnGy7TXiLI/view?usp=drive_link",
            ano: "2012",
            sinopsis: "Drama histórico sobre la persecución religiosa en México en los años 20 y la valentía de los mártires cristeros que defendieron la libertad de la Iglesia."
        },
        {
            titulo: "San Agustín de Hipona",
            imagen: "santos_san_agustin.jpg",
            url: "https://drive.google.com/file/d/1LTlVDb_14r8xtPO8xFP7dkokosEKqpDH/view?usp=drive_link",
            ano: "2010",
            sinopsis: "La extraordinaria conversión de Agustín gracias a las oraciones de su madre Santa Mónica, hasta convertirse en uno de los más grandes Padres de la Iglesia."
        },
        {
            titulo: "Santa Faustina",
            imagen: "santos_santa_faustina.jpg",
            url: "https://drive.google.com/file/d/1vG-X4-NaCzw3D3_p3uMTYoTklf7hFsZe/view?usp=drive_link",
            ano: "1994",
            sinopsis: "Vida de Santa Faustina Kowalska, la humilde religiosa polaca a quien Jesús confió el mensaje y la devoción de la Divina Misericordia."
        },
        {
            titulo: "Santa Rosa de Lima",
            imagen: "santos_santa_rosa_lima.jpg",
            url: "https://drive.google.com/file/d/1_cFlUDapB5cllb-UbL83Wxp21DYMZKmk/view?usp=drive_link",
            ano: "Cine",
            sinopsis: "Historia de Isabel Flores de Oliva, la primera santa de América, ejemplo de penitencia, amor a los necesitados y entrega total a Cristo."
        },
        {
            titulo: "Fray Escoba (San Martín de Porres)",
            imagen: "santos_fray_escoba.jpg",
            url: "https://drive.google.com/file/d/1_zXiyLLYq-ewqA_h-3TFtcjV-ZoVaLoY/view?usp=drive_link",
            ano: "1961",
            sinopsis: "Clásico sobre la humildad, la caridad heroica y los milagros de San Martín de Porres, el fraile dominico que sirvió a todos con alegría en Lima."
        },
        {
            titulo: "El Primado de Polonia",
            imagen: "santos_primado_polonia.jpg",
            url: "https://youtu.be/U7rT0jlREGs?si=dU_C_xqeU2tCLwzV",
            ano: "2000",
            sinopsis: "La firmeza pastoral del Beato Cardenal Stefan Wyszyński frente al régimen comunista durante los años más difíciles para la Iglesia en Polonia."
        },
        {
            titulo: "El Amor de los Amores",
            imagen: "santos_amor_amores.jpg",
            url: "https://drive.google.com/file/d/13-qe3HvmO9yJpoRy_eQhm4HMP9tTJHIn/view?usp=drive_link",
            ano: "Cine",
            sinopsis: "Relato de entrega, fe y superación espiritual centrado en el amor incondicional a Dios y al prójimo."
        },
        {
            titulo: "Mártir de la Pureza (Santa María Goretti)",
            imagen: "santos_maria_goretti.jpg",
            url: "https://drive.google.com/file/d/1tIErA-YIDUNBAmbhMj-3akn4tLd61NUr/view?usp=drive_link",
            ano: "2003",
            sinopsis: "Conmovedora historia de la joven mártir italiana que prefirió entregar su vida antes que ofender a Dios, perdonando a su agresor antes de morir."
        },
        {
            titulo: "San Patricio de Irlanda",
            imagen: "santos_patricio.jpg",
            url: "https://drive.google.com/file/d/1PTuWIiIQwW67WDX02a5k79OdqVkP6-f3/view?usp=drive_link",
            ano: "2000",
            sinopsis: "La misión evangelizadora de San Patricio, quien regresó a la tierra donde fue esclavo para llevar la luz del Evangelio a toda Irlanda."
        },
        {
            titulo: "Santa Francisca Javier Cabrini",
            imagen: "santos_cabrini.jpg",
            url: "https://drive.google.com/file/d/1ZdvKawT19VKqhvTganLyPdN2wYJyEdzW/view?usp=drive_link",
            ano: "2024",
            sinopsis: "La incansable labor misionera de la Madre Cabrini, patrona de los migrantes, fundando escuelas, orfanatos y hospitales movida por su fe."
        },
        {
            titulo: "Hermana Clare Crockett (O todo o nada)",
            imagen: "santos_clare_crockett.jpg",
            url: "https://drive.google.com/file/d/1eyc1JUxgimta5BOL4zbkBcW2T8ETOZXN/view?usp=drive_link",
            ano: "2018",
            sinopsis: "Documental biográfico sobre la joven actriz irlandesa que lo dejó todo por Cristo y entregó su vida con alegría como religiosa misionera."
        },
        {
            titulo: "El Secreto de Teresa",
            imagen: "santos_teresa_lisieux.jpg",
            url: "https://drive.google.com/file/d/1QVVaHCgYvres0M1XykhwevjIhFK9dqig/view?usp=drive_link",
            ano: "Doc",
            sinopsis: "Acercamiento a la espiritualidad del 'caminito' de Santa Teresa del Niño Jesús, Doctora de la Iglesia y patrona de las misiones."
        },
        {
            titulo: "Cántico de Magdalena",
            imagen: "santos_cantico_magdalena.jpg",
            url: "https://drive.google.com/file/d/16cPsk6y0gtYRFAMW1id0YrsTI1m3k1Hv/view?usp=drive_link",
            ano: "Cine",
            sinopsis: "Retrato de la conversión, fidelidad y amor de Santa María Magdalena, testigo privilegiada de la resurrección del Señor."
        },
        {
            titulo: "San Francisco de Asís",
            imagen: "santos_francisco_asis.jpg",
            url: "https://drive.google.com/file/d/1F53Ds4T5DHzJDZ-FIFU-ctOIofSgZ7rZ/view?usp=drive_link",
            ano: "Cine",
            sinopsis: "La vida del joven rico de Asís que abrazó la pobreza evangélica y renovó la Iglesia con su amor radical a Cristo crucificado."
        },
        {
            titulo: "San José de Cupertino (El hombre que no quería ser santo)",
            imagen: "santos_jose_cupertino.jpg",
            url: "https://drive.google.com/file/d/1HqPZOF4hmrqU5cKCHcH-G0mk_V6NhsjG/view?usp=drive_link",
            ano: "1962",
            sinopsis: "Clásico biográfico sobre el humilde fraile franciscano conocido por sus dones místicos, su obediencia y su profunda devoción eucarística."
        },
        {
            titulo: "San Isidro Labrador",
            imagen: "santos_isidro_labrador.jpg",
            url: "https://drive.google.com/file/d/1zmEE_ck62bGwDi4_DcYj541Bo1KjM4m4/view?usp=drive_link",
            ano: "1964",
            sinopsis: "Historia del santo campesino de Madrid que santificó el trabajo diario, la vida familiar y la caridad hacia los más necesitados."
        },
        {
            titulo: "San Ignacio de Loyola",
            imagen: "santos_ignacio_loyola.jpg",
            url: "https://youtu.be/WTRDQanmVJE?si=yUoFmu5kWpjVdsFx",
            ano: "2016",
            sinopsis: "De soldado ambicioso a fundador de la Compañía de Jesús: la batalla espiritual y conversión de San Ignacio de Loyola."
        },
        {
            titulo: "Don Bosco",
            imagen: "santos_don_bosco.jpg",
            url: "https://youtu.be/c2BerCzDOOU?si=-PPBhhBnPsUuxmQ2",
            ano: "2004",
            sinopsis: "La apasionante entrega de San Juan Bosco por los jóvenes abandonados de Turín, fundando la obra salesiana bajo el auxilio de María."
        },
        {
            titulo: "Bakhita",
            imagen: "santos_bakhita.jpg",
            url: "https://drive.google.com/file/d/18cwD1-1yHUsgIO-L3AxvovP74_p2ttLu/view?usp=drive_link",
            ano: "2009",
            sinopsis: "La historia real de Santa Josefina Bakhita, quien tras sufrir la esclavitud en Sudán encontró la verdadera libertad en Cristo."
        },
        {
            titulo: "Clara y Francisco",
            imagen: "santos_clara_francisco.jpg",
            url: "https://youtu.be/L6jd4DpLzs0?si=SpoWpuNj59vRg2KS",
            ano: "2007",
            sinopsis: "Retrato de la amistad espiritual y vocación compartida de San Francisco y Santa Clara de Asís en el seguimiento radical del Evangelio."
        }
    ],

    // 4. Iglesia, Fe y Vocación
    "iglesia": [
        {
            titulo: "Las llaves del reino",
            imagen: "iglesia_llaves_reino.jpg",
            url: "https://drive.google.com/file/d/1T2qAj_pAOu0JbrY85iOT7_BRQYIrzFeu/view?usp=drive_link",
            ano: "1944",
            sinopsis: "La vida del padre Francis Chisholm, un sacerdote escocés enviado como misionero a China que da testimonio de fe, humildad y perseverancia."
        },
        {
            titulo: "Quo Vadis",
            imagen: "iglesia_quo_vadis.jpg",
            url: "https://drive.google.com/file/d/1WvBQszE1tGTGhoL0pmjex2RXZ1ffg9xa/view?usp=drive_link",
            ano: "1951",
            sinopsis: "Épica historia ambientada en la Roma del emperador Nerón que retrata la fe heroica de los primeros cristianos y el testimonio del apóstol San Pedro."
        },
        {
            titulo: "La Misión",
            imagen: "iglesia_la_mision.jpg",
            url: "https://drive.google.com/file/d/1RVqrKZr263AeOliC6YnpMVTB10M_GwYT/view?usp=drive_link",
            ano: "1986",
            sinopsis: "En el siglo XVIII, misioneros jesuitas en Sudamérica defienden con valentía y fe a las comunidades guaraníes frente a los intereses coloniales."
        },
        {
            titulo: "Un trozo de pan",
            imagen: "iglesia_trozo_pan.jpg",
            url: "https://drive.google.com/file/d/1Oz3O0igvb5TVdAPT0DDafStsGRPefbFj/view?usp=drive_link",
            ano: "Cine",
            sinopsis: "Historia reflexiva sobre la caridad cristiana, la providencia divina y el valor de compartir con los más necesitados."
        },
        {
            titulo: "La Fe",
            imagen: "iglesia_la_fe.jpg",
            url: "https://drive.google.com/file/d/1sGBXkWnSWnFf7eiG6qEJW7tb2Qzt8dap/view?usp=drive_link",
            ano: "1947",
            sinopsis: "Drama clásico sobre las pruebas interiores de un sacerdote y el triunfo de la fe y la fidelidad vocacional."
        },
        {
            titulo: "La Cabaña",
            imagen: "iglesia_la_cabana.jpg",
            url: "https://drive.google.com/file/d/1k86ic2fs-ferreTDYSONGoHJ5DLH_uiK/view?usp=drive_link",
            ano: "2017",
            sinopsis: "Tras una profunda tragedia familiar, un padre emprende un viaje espiritual que lo enfrenta al dolor, el perdón y la misericordia de Dios."
        },
        {
            titulo: "Dolor, luto y muerte",
            imagen: "iglesia_dolor_luto_muerte.jpg",
            url: "https://youtu.be/a5LnZsof2hA?si=VKJnyeP_hYRwSC3h",
            ano: "Doc",
            sinopsis: "Reflexión católica sobre el sentido del sufrimiento humano, el duelo y la esperanza cristiana en la vida eterna."
        },
        {
            titulo: "El género es inmutable",
            imagen: "iglesia_genero_inmutable.jpg",
            url: "https://youtu.be/A6mn9hCneXQ?si=bF5XaURXYLAjim6b",
            ano: "Doc",
            sinopsis: "Análisis desde la antropología cristiana y la ley natural sobre la dignidad y verdad del ser humano creado varón y mujer."
        },
        {
            titulo: "Un hombre para la eternidad",
            imagen: "iglesia_hombre_eternidad.jpg",
            url: "https://youtu.be/Wi11JfrqkX8?si=GGmd93f5eOZanwbN",
            ano: "1966",
            sinopsis: "La integridad inquebrantable de Santo Tomás Moro, canciller de Inglaterra, quien prefirió el martirio antes que traicionar su conciencia y la fe católica."
        },
        {
            titulo: "Diálogo de Carmelitas",
            imagen: "iglesia_dialogo_carmelitas.jpg",
            url: "https://drive.google.com/file/d/1RNxdGV2KbulwXcpRvs9wpEp1tIJWY2dS/view?usp=drive_link",
            ano: "1960",
            sinopsis: "Basada en el martirio de las carmelitas de Compiègne durante la Revolución Francesa, una obra profunda sobre la gracia, el miedo y la entrega."
        }
    ],

    // 5. Personajes de la Biblia
    "biblia": [
        {
            titulo: "Los Diez Mandamientos",
            imagen: "biblia_diez_mandamientos.jpg",
            url: "https://drive.google.com/file/d/1KwRZd6VMpMP4NRBZt2EeSRJaRsVIcuf5/view?usp=drive_link",
            ano: "1956",
            sinopsis: "Drama bíblico ambientado en el Antiguo Egipto que narra la historia de Moisés, quien renuncia a sus privilegios para liberar al pueblo de Israel y recibir la Ley de Dios."
        },
        {
            titulo: "La Historia de Ruth",
            imagen: "biblia_historia_ruth.jpg",
            url: "https://drive.google.com/file/d/16UqkqYwK4KF0XW53-OdmM7hEPiNKoR7Z/view?usp=drive_link",
            ano: "1960",
            sinopsis: "Relato bíblico sobre la fidelidad y conversión de Rut la moabita, quien abraza la fe en el Dios verdadero y entra en la genealogía del Rey David."
        },
        {
            titulo: "El Apóstol Pedro y la Última Cena",
            imagen: "biblia_apostol_pedro.jpg",
            url: "https://drive.google.com/file/d/1BMKMrNT4bp-qe05gjlShs6EErjYCBNqW/view?usp=drive_link",
            ano: "2012",
            sinopsis: "Desde su prisión en Roma, San Pedro recuerda sus años junto a Jesús, la Última Cena y la misión de apacentar la Iglesia."
        },
        {
            titulo: "El Profeta del Desierto",
            imagen: "biblia_juan_bautista.jpg",
            url: "https://drive.google.com/file/d/1Kx7zkGlkWdmeyBgtt34CYwUKwxQx6H3K/view?usp=drive_link",
            ano: "Cine",
            sinopsis: "La vida y predicación de San Juan Bautista, el precursor enviado para preparar los caminos del Señor y señalar al Cordero de Dios."
        },
        {
            titulo: "Historia del Rey David",
            imagen: "biblia_rey_david.jpg",
            url: "https://drive.google.com/file/d/19AAa-Ejd_495T4SFPiAAIC3ZlDS6v3DG/view?usp=drive_link",
            ano: "Cine",
            sinopsis: "Basada en los libros de Samuel, narra el camino de David desde humilde pastor elegido por Dios hasta convertirse en el gran rey de Israel."
        },
        {
            titulo: "Saúl y David",
            imagen: "biblia_saul_david.jpg",
            url: "https://drive.google.com/file/d/186mOhuv4TRb1n6aQW5vPkZSgicA3Ndvh/view?usp=drive_link",
            ano: "1964",
            sinopsis: "Drama histórico sobre el reinado de Saúl, su alejamiento de Dios y el ascenso del joven David ungido por el profeta Samuel."
        },
        {
            titulo: "Pablo, Apóstol de Cristo",
            imagen: "biblia_pablo_apostol.jpg",
            url: "https://drive.google.com/file/d/1WKdEDXzvL4raBOSGZJSCMq7-nt91xHb_/view?usp=drive_link",
            ano: "2018",
            sinopsis: "En sus últimos días en prisión en Roma, San Pablo dicta sus memorias a San Lucas mientras fortalece a la Iglesia perseguida."
        },
        {
            titulo: "Abraham",
            imagen: "biblia_abraham.jpg",
            url: "https://youtu.be/gAAOOT44tes?si=3qOCCiz1Kznoq7Fo",
            ano: "1993",
            sinopsis: "La historia del patriarca Abraham, padre en la fe, llamado por Dios a dejar su tierra y confiar plenamente en su promesa."
        },
        {
            titulo: "Ester",
            imagen: "biblia_ester.jpg",
            url: "https://youtu.be/R4tu1OYN_Nw?si=tnjuYf0DfedWJoBU",
            ano: "1999",
            sinopsis: "La joven Ester, una humilde huérfana judía criada por su primo Mardoqueo, llega a ser reina de Persia y arriesga su vida para salvar a su pueblo."
        }
    ],

    // 6. Series y Documentales
    "documentales": [
        {
            titulo: "El Santo Sudario (Oviedo)",
            imagen: "doc_santo_sudario_oviedo.jpg",
            url: "https://youtu.be/Yt3qD6R50xs?si=Vcizn1GV8GlUTM8o",
            ano: "Doc",
            sinopsis: "Investigación histórica y científica sobre el Sudario custodiado en la Catedral de Oviedo y su relación con la Pasión de Cristo."
        },
        {
            titulo: "La Sábana Santa (Veredicto Ciencia)",
            imagen: "doc_sabana_santa_ciencia.jpg",
            url: "https://youtu.be/tekrDnRPakE?si=aTCvc0Is_m85KK_z",
            ano: "Doc",
            sinopsis: "Análisis de los estudios científicos realizados sobre la Síndone de Turín y los enigmas que la ciencia moderna no ha podido replicar."
        },
        {
            titulo: "Sábana Santa y el Sudario: Una perspectiva histórica",
            imagen: "doc_perspectiva_historica.jpg",
            url: "https://youtu.be/P2AoRkRa4zY?si=EEasN8RchNBZn3Nd",
            ano: "Doc",
            sinopsis: "Recorrido documental por el trayecto histórico de ambas reliquias desde Jerusalén hasta Europa."
        },
        {
            titulo: "Estudio Artístico-Anatómico",
            imagen: "doc_estudio_anatomico.jpg",
            url: "https://youtu.be/xVTPZJ89oE4?si=oJuJ3-4_gQbQPBZG",
            ano: "Doc",
            sinopsis: "Examen detallado de las proporciones anatómicas y las marcas de la Pasión reflejadas en la Sábana Santa."
        },
        {
            titulo: "Análisis Forense de las Coincidencias",
            imagen: "doc_analisis_forense.jpg",
            url: "https://youtu.be/TWvjPr7UY6c?si=UKvBJn4qPG1320sX",
            ano: "Doc",
            sinopsis: "Estudio forense que compara las manchas de sangre y heridas entre el Sudario de Oviedo y la Sábana Santa de Turín."
        },
        {
            titulo: "Jesús de Nazaret: Una Contextualización Histórica",
            imagen: "doc_jesus_contextualizacion.jpg",
            url: "https://youtu.be/TWOPiBLYN-Y?si=tEn3_B1d7x-iGGbF",
            ano: "Doc",
            sinopsis: "Contexto histórico, cultural y arqueológico de la Judea del siglo I durante el tiempo de Nuestro Señor Jesucristo."
        },
        {
            titulo: "Investigación Médica de la Muerte de Jesús",
            imagen: "doc_investigacion_medica.jpg",
            url: "https://youtu.be/1p92QV9yLio?si=CEuzIqOzGOertmve",
            ano: "Doc",
            sinopsis: "Explicación médica y fisiológica de los sufrimientos de Cristo durante la flagelación, el camino al Calvario y la crucifixión."
        }
    ],

    // 7. Sucesores de Pedro (Papas)
    "papas": [
        {
            titulo: "Habemus Papam Francisco",
            imagen: "papas_habemus_francisco.jpg",
            url: "https://youtu.be/MvT65xd-_qo",
            ano: "2013",
            sinopsis: "Momento histórico de la elección y presentación al mundo del Papa Francisco desde el balcón de la Basílica de San Pedro."
        },
        {
            titulo: "Un Papa entre la gente",
            imagen: "papas_papa_entre_gente.jpg",
            url: "https://drive.google.com/file/d/1jYsCVTMo_xSnA-2Quy3Oww_t85xNTGre/view?usp=drive_link",
            ano: "Doc",
            sinopsis: "El 13 de marzo de 2013 los cardenales eligieron a Jorge Mario Bergoglio como el primer Papa latinoamericano. Un retrato cercano de su vida y ministerio."
        },
        {
            titulo: "Liderazgo del Papa Francisco",
            imagen: "papas_liderazgo_francisco.jpg",
            url: "https://drive.google.com/file/d/1BSYSaD3GnZXodZVrMwJSmSKl5_SjtpZe/view?usp=drive_link",
            ano: "Doc",
            sinopsis: "Análisis del estilo pastoral y las prioridades del pontificado del Papa Francisco al servicio de la Iglesia universal."
        },
        {
            titulo: "La Iglesia del Papa Francisco",
            imagen: "papas_iglesia_francisco.jpg",
            url: "https://youtu.be/k_gEtBg1Zwo",
            ano: "Doc",
            sinopsis: "Documental sobre los desafíos contemporáneos de la evangelización y la misión de la Iglesia durante el pontificado de Francisco."
        },
        {
            titulo: "El Pacto de Amor: Matrimonio",
            imagen: "papas_pacto_amor.jpg",
            url: "https://youtu.be/3CprlpH0Ts4?si=zdz_yvzHLlCXS6WZ",
            ano: "Doc",
            sinopsis: "Reflexión sobre el sacramento del Matrimonio, la familia cristiana y su vocación al amor fiel."
        },
        {
            titulo: "Papa Francisco: El Papa de Todos",
            imagen: "papas_papa_de_todos.jpg",
            url: "https://drive.google.com/file/d/1PUsFnjNs4Rlcj6EuPwcURX0GjZ7rh7qs/view?usp=drive_link",
            ano: "Doc",
            sinopsis: "Recorrido por los viajes apostólicos, mensajes y gestos de cercanía del Papa Francisco con los fieles de todo el mundo."
        },
        {
            titulo: "Francisco, visto por sí mismo",
            imagen: "papas_francisco_si_mismo.jpg",
            url: "https://drive.google.com/file/d/1gB5z-CEr7EPJmOqOe_8vszhb9jNap5PP/view?usp=drive_link",
            ano: "Doc",
            sinopsis: "Testimonios y palabras del propio Pontífice sobre su vocación, su formación y su servicio como Sucesor de Pedro."
        },
        {
            titulo: "Exequias Papa Francisco",
            imagen: "papas_exequias_francisco.jpg",
            url: "https://youtu.be/P7STinAfv2c?si=vrkWYXPreHi30g1h",
            ano: "2025",
            sinopsis: "Celebración litúrgica y despedida solemne de la Iglesia universal al Papa Francisco en la Plaza de San Pedro."
        },
        {
            titulo: "Habemus Papam Benedicto XVI",
            imagen: "papas_habemus_benedicto.jpg",
            url: "https://youtu.be/BZ3Hk9Rrs94",
            ano: "2005",
            sinopsis: "Anuncio oficial y primeras palabras de Joseph Ratzinger como el Papa Benedicto XVI ante los fieles reunidos en Roma."
        },
        {
            titulo: "Benedicto XVI: En honor a la verdad",
            imagen: "papas_benedicto_verdad.jpg",
            url: "https://drive.google.com/file/d/1HCFz-tRxyy0UgLaosn1BcF5ZBMUfQqjF/view?usp=drive_link",
            ano: "Doc",
            sinopsis: "Recorrido por la vida de Joseph Ratzinger, desde su infancia en Alemania y su brillante labor teológica hasta su pontificado y los motivos de su renuncia."
        },
        {
            titulo: "Benedicto XVI: Colaborador de la verdad",
            imagen: "papas_profeta_tiempo.jpg",
            url: "https://youtu.be/JaQkOKNVO1M?si=t35IssDDpBc9l51q",
            ano: "Doc",
            sinopsis: "Semblanza del legado doctrinal, litúrgico y espiritual de Benedicto XVI en defensa de la fe y la razón."
        },
        {
            titulo: "Exequias Papa Benedicto XVI",
            imagen: "papas_exequias_benedicto.jpg",
            url: "https://youtu.be/BZ3Hk9Rrs94?si=6w3tK-PBAtgy1rjF",
            ano: "2023",
            sinopsis: "Solemne misa exequial en memoria del Papa Emérito Benedicto XVI en la Plaza de San Pedro."
        },
        {
            titulo: "Habemus Papam Juan Pablo II",
            imagen: "papas_habemus_jp2.jpg",
            url: "https://youtu.be/9a--DpBeBIM?si=UPAPYuBUutOPS957",
            ano: "1978",
            sinopsis: "La histórica tarde del 16 de octubre de 1978 cuando Karol Wojtyła fue elegido Papa y pronunció su inolvidable llamado: '¡No tengan miedo!'."
        },
        {
            titulo: "El Milagro de San Juan Pablo II",
            imagen: "papas_milagro_jp2.jpg",
            url: "https://drive.google.com/file/d/1DO11HEjuA9ExLZWE1Q1PP-1gilWORkil/view?usp=drive_link",
            ano: "Doc",
            sinopsis: "Documental sobre los milagros aprobados por la Iglesia que llevaron a la beatificación y canonización de San Juan Pablo II."
        },
        {
            titulo: "Juan Pablo II está vivo",
            imagen: "papas_jp2_esta_vivo.jpg",
            url: "https://drive.google.com/file/d/1U2sPeQLZSrBZAkBZGvdwGSzWPeOWTj7M/view?usp=drive_link",
            ano: "Doc",
            sinopsis: "Testimonios de fe, intercesión y vigencia espiritual del legado de San Juan Pablo II en la vida de millones de católicos."
        },
        {
            titulo: "Juan Pablo II: La vida de un santo",
            imagen: "papas_jp2_vida_santo.jpg",
            url: "https://drive.google.com/file/d/1clQ8jthJvkD3Dc1dq4oEGw2nPj_Jfs_1/view?usp=drive_link",
            ano: "Doc",
            sinopsis: "Biografía documental que repasa la entrega pastoral, el testimonio de oración y la santidad de Karol Wojtyła."
        },
        {
            titulo: "La Sonrisa de Juan Pablo II",
            imagen: "papas_sonrisa_jp2.jpg",
            url: "https://youtu.be/hqv2-dJyv3Y?si=QsT3s2CUOxmMIKpB",
            ano: "Doc",
            sinopsis: "La alegría, cercanía y calidez humana con la que San Juan Pablo II conquistó el corazón de jóvenes y familias en todo el mundo."
        },
        {
            titulo: "Juan Pablo II: el hombre y su época",
            imagen: "papas_jp2_hombre_epoca.jpg",
            url: "https://drive.google.com/file/d/1wXGm6kngA5qGjOObtvRJtDZwSsL4uWYp/view?usp=drive_link",
            ano: "Doc",
            sinopsis: "El impacto histórico y espiritual del pontificado de San Juan Pablo II en los grandes acontecimientos del siglo XX."
        },
        {
            titulo: "Juan Pablo II documental completo en español",
            imagen: "papas_jp2_documental_completo.jpg",
            url: "https://youtu.be/wnacv6of4Ho?si=Vr84PV0HLOx4B6u0",
            ano: "Doc",
            sinopsis: "Repaso completo por la vida, viajes apostólicos y magisterio de uno de los pontificados más trascendentes de la historia."
        },
        {
            titulo: "Karol, el hombre que se convirtió en Papa",
            imagen: "papas_karol_hombre_papa.jpg",
            url: "https://drive.google.com/file/d/1Hy__DbJHzweBaTWuIKkxHlPP3VuufKbJ/view?usp=drive_link",
            ano: "2005",
            sinopsis: "Película biográfica sobre la juventud de Karol Wojtyła en Polonia bajo la ocupación nazi y el comunismo hasta su elección como Papa."
        },
        {
            titulo: "Karol, el Papa, el Hombre",
            imagen: "papas_karol_papa_hombre.jpg",
            url: "https://drive.google.com/file/d/1zpzt51pI_5NcG61jxA94TvxLupxE6pfj/view?usp=drive_link",
            ano: "2006",
            sinopsis: "Continuación biográfica que muestra los años de pontificado de Juan Pablo II, el atentado en San Pedro y su incansable labor misionera."
        },
        {
            titulo: "Juan Pablo II, El Grande",
            imagen: "papas_jp2_el_grande.jpg",
            url: "https://youtu.be/y0HtkxxGtvg?si=rzZOsEMtMjeH81qy",
            ano: "Doc",
            sinopsis: "Homenaje a la figura, valentía y legado misionero de San Juan Pablo II."
        }
    ],

    // 8. Catequesis Respuestas
    "catequesis": [
        { titulo: "LECCION # 1 QUE ES EL HOMBRE", imagen: "cat_01_que_es_el_hombre.jpg", url: "https://youtu.be/_EknbiWIIkY", ano: "Cat", sinopsis: "Formación doctrinal católica en formato breve y claro." },
        { titulo: "LECCION # 2 QUE ES EL ALMA", imagen: "cat_02_que_es_el_alma.jpg", url: "https://youtu.be/fr6aVm4T7c0", ano: "Cat", sinopsis: "Formación doctrinal católica en formato breve y claro." },
        { titulo: "LECCION # 3 DIFERENCIA EN SABER Y CREER", imagen: "cat_03_diferencia_saber_creer.jpg", url: "https://youtu.be/z_T9EMIwqOM", ano: "Cat", sinopsis: "Formación doctrinal católica en formato breve y claro." },
        { titulo: "LECCION # 4 QUE SIGNIFICA CREER EN DIOS", imagen: "cat_04_creer_en_dios.jpg", url: "https://youtu.be/qewXXVpI_Ws", ano: "Cat", sinopsis: "Formación doctrinal católica en formato breve y claro." },
        { titulo: "LECCION # 5 HAY PRUEBAS SOBRE LA EXISTENCIA DE DIOS", imagen: "cat_05_pruebas_existencia_dios.jpg", url: "https://youtu.be/HfvDWfgAdRg", ano: "Cat", sinopsis: "Formación doctrinal católica en formato breve y claro." },
        { titulo: "LECCION # 6 QUE SON LOS MILAGROS", imagen: "cat_06_que_son_milagros.jpg", url: "https://youtu.be/xWMC1Cxm_1E", ano: "Cat", sinopsis: "Formación doctrinal católica en formato breve y claro." },
        { titulo: "LECCION # 7 POR QUE DIOS SE REVELA ASI MISMO", imagen: "cat_07_dios_se_revela.jpg", url: "https://youtu.be/L9jdDIiSVYU", ano: "Cat", sinopsis: "Formación doctrinal católica en formato breve y claro." },
        { titulo: "LECCION # 8 COMO SEA REVELADO DIOS", imagen: "cat_08_como_se_ha_revelado.jpg", url: "https://youtu.be/e5fOQ6cpfXg", ano: "Cat", sinopsis: "Formación doctrinal católica en formato breve y claro." },
        { titulo: "LECCION # 9 COMO SE TRANSMITE LA REVELACION", imagen: "cat_09_como_transmite_revelacion.jpg", url: "https://youtu.be/-sW-jsjQR4Y", ano: "Cat", sinopsis: "Formación doctrinal católica en formato breve y claro." },
        { titulo: "LECCION # 10 CUALES SON LAS PARTES DE LA BIBLIA", imagen: "cat_10_partes_de_la_biblia.jpg", url: "https://youtu.be/TymqUKUSiis", ano: "Cat", sinopsis: "Formación doctrinal católica en formato breve y claro." },
        { titulo: "LECCION # 11 QUIEN DECIDIO QUE Y QUE NO ES PARTE DE LA BIBLIA", imagen: "cat_11_quien_decidio_biblia.jpg", url: "https://youtu.be/emx-NtzssAU", ano: "Cat", sinopsis: "Formación doctrinal católica en formato breve y claro." },
        { titulo: "LECCION # 12 QUIEN ES DIOS", imagen: "cat_12_quien_es_dios.jpg", url: "https://youtu.be/02j-WAO5qyM", ano: "Cat", sinopsis: "Formación doctrinal católica en formato breve y claro." },
        { titulo: "LECCION # 13 ES DIOS EN REALIDAD TODOPODEROSO", imagen: "cat_13_dios_todopoderoso.jpg", url: "https://youtu.be/G7yCZZmH15c", ano: "Cat", sinopsis: "Formación doctrinal católica en formato breve y claro." },
        { titulo: "LECCION # 14 DIOS ES VERDADERAMENTE INMUTABLE", imagen: "cat_14_dios_inmutable.jpg", url: "https://youtu.be/A4rWxxRaK4k", ano: "Cat", sinopsis: "Formación doctrinal católica en formato breve y claro." },
        { titulo: "LECCION # 15 ES DIOS UN HOMBRE DE BARBA LARGA", imagen: "cat_15_dios_barba_larga.jpg", url: "https://youtu.be/6d2tjiNXrgI", ano: "Cat", sinopsis: "Formación doctrinal católica en formato breve y claro." },
        { titulo: "LECCION # 16 QUE SIGNIFICA QUE DIOS ES LA TRINIDAD", imagen: "cat_16_dios_es_trinidad.jpg", url: "https://youtu.be/8D-kofJFKLg", ano: "Cat", sinopsis: "Formación doctrinal católica en formato breve y claro." },
        { titulo: "LECCION # 17 COMO PODEMOS RESUMIR LA CREENCIA EN LA SANTISIMA TRINIDAD", imagen: "cat_17_resumir_creencia_trinidad.jpg", url: "https://youtu.be/Tv5WjtTtme8", ano: "Cat", sinopsis: "Formación doctrinal católica en formato breve y claro." },
        { titulo: "LECCION # 18 COMO PODEMOS ENTENDER A LA TRINIDAD", imagen: "cat_18_entender_la_trinidad.jpg", url: "https://youtu.be/35fnTBTOkdE", ano: "Cat", sinopsis: "Formación doctrinal católica en formato breve y claro." },
        { titulo: "LECCION # 19 QUE IMAGENES TENEMOS DE LA SANTISIMA TRINIDAD", imagen: "cat_19_imagenes_de_trinidad.jpg", url: "https://youtu.be/9Z2MpYzFdSE", ano: "Cat", sinopsis: "Formación doctrinal católica en formato breve y claro." },
        { titulo: "LECCION # 20 QUE SIGNIFICA QUE DIOS ES AMOR", imagen: "cat_20_dios_es_amor.jpg", url: "https://youtu.be/r_xeAZlHsnc", ano: "Cat", sinopsis: "Formación doctrinal católica en formato breve y claro." },
        { titulo: "LECCION # 21 DE ACUERDO A LA IGLESIA QUE ES CREACION", imagen: "cat_21_que_es_creacion.jpg", url: "https://youtu.be/ZI3APYJqrmY", ano: "Cat", sinopsis: "Formación doctrinal católica en formato breve y claro." },
        { titulo: "LECCION # 22 HAY ALGUNA CONTRADICCION ENTRE FE Y CIENCIA", imagen: "cat_22_contradiccion_fe_ciencia.jpg", url: "https://youtu.be/Du3Xylscp6Y", ano: "Cat", sinopsis: "Formación doctrinal católica en formato breve y claro." },
        { titulo: "LECCION # 23 HAY ALGUNA CONTRADICCION EMTRE LA TEORIA DE LA CRECION DE LA BIBLIA Y LA CIENCIA", imagen: "cat_23_creacion_vs_ciencia.jpg", url: "https://youtu.be/31cHxJeNGIY", ano: "Cat", sinopsis: "Formación doctrinal católica en formato breve y claro." },
        { titulo: "LECCION # 24 QUE ES EL MAL", imagen: "cat_24_que_es_el_mal.jpg", url: "https://youtu.be/S94dgs_s_vI", ano: "Cat", sinopsis: "Formación doctrinal católica en formato breve y claro." },
        { titulo: "LECCION # 25 A QUE SE REFIEREN CON LA CAIDA DEL HOMBRE Y EL PECADO ORIGINAL", imagen: "cat_25_caida_pecado_original.jpg", url: "https://youtu.be/k1B8D4lczkM", ano: "Cat", sinopsis: "Formación doctrinal católica en formato breve y claro." },
        { titulo: "LECCION # 26 EXISTE EL DIABLO", imagen: "cat_26_existe_el_diablo.jpg", url: "https://youtu.be/LXs5wqWOiew", ano: "Cat", sinopsis: "Formación doctrinal católica en formato breve y claro." },
        { titulo: "LECCION # 27 QUIEN ERA JESUS", imagen: "cat_27_quien_era_jesus.jpg", url: "https://youtu.be/p4eHd-1SPmc", ano: "Cat", sinopsis: "Formación doctrinal católica en formato breve y claro." },
        { titulo: "LECCION # 28 POR QUE DIOS SE HIZO HOMBRE", imagen: "cat_28_por_que_dios_hizo_hombre.jpg", url: "https://youtu.be/zvjwodRXjeo", ano: "Cat", sinopsis: "Formación doctrinal católica en formato breve y claro." },
        { titulo: "LECCION # 29 POR QUE JESUS VINO AL MUNDO HACE 2000 AÑOS", imagen: "cat_29_por_que_jesus_vino.jpg", url: "https://youtu.be/tDsKosjgDH4", ano: "Cat", sinopsis: "Formación doctrinal católica en formato breve y claro." },
        { titulo: "LECCION # 30 COMO VIVIO JESUS", imagen: "cat_30_como_vivio_jesus.jpg", url: "https://youtu.be/ZrjYE7-RR9s", ano: "Cat", sinopsis: "Formación doctrinal católica en formato breve y claro." },
        { titulo: "LECCION # 31 COMO ES DIFERENTE JESUS DE LOS FUNDADORES DE OTRAS RELIGIONES", imagen: "cat_31_jesus_vs_fundadores.jpg", url: "https://youtu.be/RF1jqbwuDms", ano: "Cat", sinopsis: "Formación doctrinal católica en formato breve y claro." },
        { titulo: "LECCION # 32 COMO FUE QUE JESUS NOS SALVO EN LA CRUZ", imagen: "cat_32_jesus_salvo_en_cruz.jpg", url: "https://youtu.be/6uEU9CZ2tkU", ano: "Cat", sinopsis: "Formación doctrinal católica en formato breve y claro." },
        { titulo: "LECCION # 33 COMO ES QUE LA GRACIA DE LA SALVACION LLEGA A NOSOTROS", imagen: "cat_33_como_llega_gracia.jpg", url: "https://youtu.be/JF9qMGsr__A", ano: "Cat", sinopsis: "Formación doctrinal católica en formato breve y claro." },
        { titulo: "LECCION # 34 QUE ES LA GRACIA", imagen: "cat_34_que_es_la_gracia.jpg", url: "https://youtu.be/4-KH2exYZzs", ano: "Cat", sinopsis: "Formación doctrinal católica en formato breve y claro." },
        { titulo: "LECCION # 35 COMO RECIBIR UN AUMENTO DE GRACIA", imagen: "cat_35_como_recibir_gracia.jpg", url: "https://youtu.be/Y8hIrhDxZ_I", ano: "Cat", sinopsis: "Formación doctrinal católica en formato breve y claro." },
        { titulo: "LECCION # 36 QUE ES EL BAUTISMO", imagen: "cat_36_que_es_bautismo.jpg", url: "https://youtu.be/B3qzh6n4kv4", ano: "Cat", sinopsis: "Formación doctrinal católica en formato breve y claro." },
        { titulo: "LECCION # 37 QUE ES LA CONFIRMACION", imagen: "cat_37_que_es_confirmacion.jpg", url: "https://youtu.be/GFdcGui6xV4", ano: "Cat", sinopsis: "Formación doctrinal católica en formato breve y claro." },
        { titulo: "LECCION # 38 QUE ES LA EUCARISTIA", imagen: "cat_38_que_es_eucaristia.jpg", url: "https://youtu.be/5FNbhAOZRUU", ano: "Cat", sinopsis: "Formación doctrinal católica en formato breve y claro." },
        { titulo: "LECCION # 39 QUE ES LA SANTA MISA", imagen: "cat_39_que_es_santa_misa.jpg", url: "https://youtu.be/w8GO5MlK6og", ano: "Cat", sinopsis: "Formación doctrinal católica en formato breve y claro." },
        { titulo: "LECCION # 40 CUALES SON LAS PARTES DE LA MISA", imagen: "cat_40_partes_de_misa.jpg", url: "https://youtu.be/vCwP8_RF-oI", ano: "Cat", sinopsis: "Formación doctrinal católica en formato breve y claro." },
        { titulo: "LECCION # 41 QUE ES EL PECADO", imagen: "cat_41_que_es_pecado.jpg", url: "https://youtu.be/OfY7btBuYIk", ano: "Cat", sinopsis: "Formación doctrinal católica en formato breve y claro." },
        { titulo: "LECCION # 42 QUE SON LOS 10 MANDAMIENTOS", imagen: "cat_42_los_10_mandamientos.jpg", url: "https://youtu.be/ntIe7ZbavRw", ano: "Cat", sinopsis: "Formación doctrinal católica en formato breve y claro." },
        { titulo: "LECCION # 43 CUALES SON LOS 7 PECADOS CAPITALES", imagen: "cat_43_7_pecados_capitales.jpg", url: "https://youtu.be/JkWs5UWVi3U", ano: "Cat", sinopsis: "Formación doctrinal católica en formato breve y claro." },
        { titulo: "LECCION # 44 QUE ES LA CONFESION", imagen: "cat_44_que_es_confesion.jpg", url: "https://youtu.be/f4l8Cd0fDrk", ano: "Cat", sinopsis: "Formación doctrinal católica en formato breve y claro." },
        { titulo: "LECCION # 45 QUE ES LA UNCION DE LOS ENFERMOS", imagen: "cat_45_uncion_enfermos.jpg", url: "https://youtu.be/652Hfv5KjBM", ano: "Cat", sinopsis: "Formación doctrinal católica en formato breve y claro." },
        { titulo: "LECCION # 46 QUE ES UN SACERDOTE CATOLICO", imagen: "cat_46_sacerdote_catolico.jpg", url: "https://youtu.be/2oK6GpsP7w4", ano: "Cat", sinopsis: "Formación doctrinal católica en formato breve y claro." },
        { titulo: "LECCION # 47 CUALES SON LOS GRADOS DEL ORDEN SACERDOTAL", imagen: "cat_47_grados_orden_sacerdotal.jpg", url: "https://youtu.be/OVioWhNOJgY", ano: "Cat", sinopsis: "Formación doctrinal católica en formato breve y claro." },
        { titulo: "LECCION # 48 QUE ES EL MATRIMONIO", imagen: "cat_48_que_es_matrimonio.jpg", url: "https://youtu.be/yxcQqpJWfTQ", ano: "Cat", sinopsis: "Formación doctrinal católica en formato breve y claro." },
        { titulo: "LECCION # 49 QUE ES EL SEXO", imagen: "cat_49_que_es_sexo.jpg", url: "https://youtu.be/l_q2j9g98Ws", ano: "Cat", sinopsis: "Formación doctrinal católica en formato breve y claro." },
        { titulo: "LECCION # 50 QUE ENSEÑA LA IGLESIA SOBRE LA MORALIDAD SEXUAL", imagen: "cat_50_ensenanza_moral_sexual.jpg", url: "https://youtu.be/68wZpWAM0uo", ano: "Cat", sinopsis: "Formación doctrinal católica en formato breve y claro." },
        { titulo: "LECCION # 51 QUIEN ES EL ESPIRITU SANTO", imagen: "cat_51_quien_es_espiritu_santo.jpg", url: "https://youtu.be/L9PvFBaLkgA", ano: "Cat", sinopsis: "Formación doctrinal católica en formato breve y claro." },
        { titulo: "LECCION # 52 QUE ES LA IGLESIA", imagen: "cat_52_que_es_la_iglesia.jpg", url: "https://youtu.be/kEmsRGJHTww", ano: "Cat", sinopsis: "Formación doctrinal católica en formato breve y claro." },
        { titulo: "LECCION # 53 CUALES SON LAS 4 CARACTERISTICAS DE LA IGLESIA", imagen: "cat_53_4_caracteristicas_iglesia.jpg", url: "https://youtu.be/vbg-ImcPj74", ano: "Cat", sinopsis: "Formación doctrinal católica en formato breve y claro." },
        { titulo: "LECCION # 54 POR QUE EXISTE LA IGLESIA", imagen: "cat_54_por_que_existe_iglesia.jpg", url: "https://youtu.be/qhGaepSrAkI", ano: "Cat", sinopsis: "Formación doctrinal católica en formato breve y claro." },
        { titulo: "LECCION # 55 COMO SE COMPONE LA ESTRUCTURA DE LA IGLESIA", imagen: "cat_55_estructura_de_iglesia.jpg", url: "https://youtu.be/8wkBt6vSSH0", ano: "Cat", sinopsis: "Formación doctrinal católica en formato breve y claro." },
        { titulo: "LECCION # 56 QUE SON LOS MONJES, MONJAS Y ORDENES RELIGIOSAS", imagen: "cat_56_monjes_monjas_ordenes.jpg", url: "https://youtu.be/tiIUewSkbCY", ano: "Cat", sinopsis: "Formación doctrinal católica en formato breve y claro." },
        { titulo: "LECCION # 57 QUE Y CUANTOS", imagen: "cat_57_que_y_cuantos.jpg", url: "https://youtu.be/0DDT1w3G5Jc", ano: "Cat", sinopsis: "Formación doctrinal católica en formato breve y claro." },
        { titulo: "LECCION # 58 CRITICAS CONTRA LA IGLESIA", imagen: "cat_58_criticas_contra_iglesia.jpg", url: "https://youtu.be/Dt7dExtbHXY", ano: "Cat", sinopsis: "Formación doctrinal católica en formato breve y claro." },
        { titulo: "LECCION # 59 POR QUE LOS CATOLICOS NOS ENCOMENDAMOS A LOS SANTOS", imagen: "cat_59_encomendarnos_a_santos.jpg", url: "https://youtu.be/npd5xOgIjVM", ano: "Cat", sinopsis: "Formación doctrinal católica en formato breve y claro." },
        { titulo: "LECCION # 60 QUIEN ES MARIA", imagen: "cat_60_quien_es_maria.jpg", url: "https://youtu.be/HMRaWXfNR7Q", ano: "Cat", sinopsis: "Formación doctrinal católica en formato breve y claro." },
        { titulo: "LECCION # 61 QUE PASA AL FINAL DE NUESTRAS VIDAS", imagen: "cat_61_final_de_nuestras_vidas.jpg", url: "https://youtu.be/klsX-6On8Bk", ano: "Cat", sinopsis: "Formación doctrinal católica en formato breve y claro." },
        { titulo: "LECCION # 62 QUE HAREMOS EN EL CIELO", imagen: "cat_62_que_haremos_en_cielo.jpg", url: "https://youtu.be/atEOCSGR4S0", ano: "Cat", sinopsis: "Formación doctrinal católica en formato breve y claro." },
        { titulo: "LECCION # 63 QUE ES EL PURGATORIO", imagen: "cat_63_que_es_purgatorio.jpg", url: "https://youtu.be/k3q2GNDOSc4", ano: "Cat", sinopsis: "Formación doctrinal católica en formato breve y claro." },
        { titulo: "LECCION # 64 QUE ES EL INFIERNO", imagen: "cat_64_que_es_infierno.jpg", url: "https://youtu.be/eprNfqcb2E4", ano: "Cat", sinopsis: "Formación doctrinal católica en formato breve y claro." },
        { titulo: "LECCION # 65 QUE ES EL HOMBRE A LA LUZ DE LA FE", imagen: "cat_65_hombre_luz_de_fe.jpg", url: "https://youtu.be/olLGZfo17MI", ano: "Cat", sinopsis: "Formación doctrinal católica en formato breve y claro." },
        { titulo: "LECCION # 66 ESTAN TODOS LLAMADOS A LA SANTIDAD", imagen: "cat_66_llamados_a_santidad.jpg", url: "https://youtu.be/V2Uiz79Vxck", ano: "Cat", sinopsis: "Formación doctrinal católica en formato breve y claro." },
        { titulo: "LECCION # 67 QUE SON LAS VIRTUDES?", imagen: "cat_67_que_son_virtudes.jpg", url: "https://youtu.be/_ALGDpQQFXU", ano: "Cat", sinopsis: "Formación doctrinal católica en formato breve y claro." },
        { titulo: "LECCION # 68 QUE ES LA ORACION?", imagen: "cat_68_que_es_la_oracion.jpg", url: "https://youtu.be/7-jfyrczzfY", ano: "Cat", sinopsis: "Formación doctrinal católica en formato breve y claro." },
        { titulo: "LECCION # 69 CUAL ES EL PAPEL DEL CUERPO EN LA ORACION", imagen: "cat_69_papel_cuerpo_oracion.jpg", url: "https://youtu.be/gsAzjWSggOc", ano: "Cat", sinopsis: "Formación doctrinal católica en formato breve y claro." },
        { titulo: "LECCION # 70 QUE ES EL PADRE NUESTRO", imagen: "cat_70_que_es_padre_nuestro.jpg", url: "https://youtu.be/uET_ok53VZs", ano: "Cat", sinopsis: "Formación doctrinal católica en formato breve y claro." }
    ],

    // 9. Apologética Católica
    "apologetica": []
};

// Diccionario para títulos formales en la interfaz
window.titulosCategorias = {
    "dios": "Nuestro Señor Jesucristo",
    "maria": "Santa María Madre de Dios",
    "santos": "Vida de los Santos",
    "iglesia": "Iglesia, Fe y Vocación",
    "biblia": "Personajes de la Biblia",
    "documentales": "Series y Documentales",
    "papas": "Sucesores de Pedro (Papas)",
    "catequesis": "Catequesis Respuestas",
    "apologetica": "Apologética Católica"
};