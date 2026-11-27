export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Método no permitido.' });
  }

  const escapeHtml = (str = '') =>
    String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

  try {
    const body = typeof req.body === 'string'
      ? JSON.parse(req.body || '{}')
      : (req.body || {});

    // Filtro silencioso contra robots de spam
    if (body.website && String(body.website).trim() !== '') {
      return res.status(200).json({ ok: true });
    }

    const nombre = String(body.nombre || '').trim().slice(0, 120);
    const correo = String(body.correo || '').trim().slice(0, 160);
    const asuntoClave = String(body.asunto || '').trim().toLowerCase();
    const mensaje = String(body.mensaje || '').trim().slice(0, 5000);

    if (!nombre || !correo || !asuntoClave || !mensaje) {
      return res.status(400).json({
        ok: false,
        error: 'Por favor completa todos los campos del formulario.'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(correo)) {
      return res.status(400).json({
        ok: false,
        error: 'Ingresa una dirección de correo electrónico válida.'
      });
    }

    const RUTAS_ASUNTO = {
      duda: {
        etiqueta: 'Duda doctrinal o apologética',
        destino: 'info@apologeticaccar.com'
      },
      material: {
        etiqueta: 'Solicitud de material',
        destino: 'info@apologeticaccar.com'
      },
      colaboracion: {
        etiqueta: 'Colaboración / Apoyo a la obra',
        destino: 'colaboradores@apologeticaccar.com'
      },
      diseno: {
        etiqueta: 'Diseño web / Soporte del portal',
        destino: 'olgwal@apologeticaccar.com'
      },
      otro: {
        etiqueta: 'Otro asunto institucional',
        destino: 'info@apologeticaccar.com'
      }
    };

    const rutaElegida = RUTAS_ASUNTO[asuntoClave] || RUTAS_ASUNTO.otro;

    const smtpUser = String(process.env.SMTP_USER || '').trim();
    const smtpPass = String(process.env.SMTP_PASS || '').replace(/\s+/g, '');

    if (!smtpUser || !smtpPass) {
      console.error('Faltan las variables SMTP_USER o SMTP_PASS en Vercel.');
      return res.status(500).json({
        ok: false,
        error: 'El buzón institucional está en configuración. Escríbenos directamente a info@apologeticaccar.com.'
      });
    }

    const nmModulo = await import('nodemailer');
    const nodemailer = nmModulo.default || nmModulo;

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: smtpUser,
        pass: smtpPass
      }
    });

    const nombreSeguro = nombre.replace(/[\r\n"]/g, '');
    const htmlMensaje = escapeHtml(mensaje).replace(/\r?\n/g, '<br>');

    await transporter.sendMail({
      from: `"Portal ACCAR" <${smtpUser}>`,
      to: rutaElegida.destino,
      replyTo: `"${nombreSeguro}" <${correo}>`,
      subject: `[Contacto ACCAR] ${rutaElegida.etiqueta} — ${nombreSeguro}`,
      text: [
        'NUEVO MENSAJE DESDE EL PORTAL ACCAR',
        '----------------------------------------',
        `Nombre: ${nombre}`,
        `Correo: ${correo}`,
        `Motivo: ${rutaElegida.etiqueta}`,
        `Buzón destino: ${rutaElegida.destino}`,
        '----------------------------------------',
        '',
        mensaje
      ].join('\n'),
      html: `
        <div style="background:#061024;padding:32px 20px;font-family:Georgia,'Times New Roman',serif;color:#f8efd3;">
          <div style="max-width:640px;margin:0 auto;background:#09172d;border:1px solid #d4af37;border-radius:16px;overflow:hidden;">
            <div style="padding:24px 28px;border-bottom:1px solid rgba(212,175,55,0.35);text-align:center;background:#040b1c;">
              <div style="color:#e8cb72;font-size:11px;letter-spacing:2px;text-transform:uppercase;font-weight:bold;margin-bottom:8px;">✠ Veritas in Caritate ✠</div>
              <h2 style="margin:0;color:#fff9ec;font-size:22px;">Nuevo Mensaje Institucional</h2>
            </div>
            <div style="padding:28px;">
              <p style="margin:0 0 10px;color:#eae0c8;font-size:15px;"><strong style="color:#eed076;">Remitente:</strong> ${escapeHtml(nombre)}</p>
              <p style="margin:0 0 10px;color:#eae0c8;font-size:15px;"><strong style="color:#eed076;">Correo de respuesta:</strong> <a href="mailto:${escapeHtml(correo)}" style="color:#88c7f2;text-decoration:none;">${escapeHtml(correo)}</a></p>
              <p style="margin:0 0 22px;color:#eae0c8;font-size:15px;"><strong style="color:#eed076;">Motivo:</strong> ${escapeHtml(rutaElegida.etiqueta)}</p>
              <div style="padding:20px;border-radius:12px;border:1px solid rgba(212,175,55,0.28);background:#050d20;color:#fff9ec;font-size:15px;line-height:1.75;">
                ${htmlMensaje}
              </div>
              <p style="margin:22px 0 0;color:rgba(234,224,200,0.65);font-size:12px;text-align:center;">
                Puedes responder directamente a este correo para contestarle a ${escapeHtml(nombre)}.
              </p>
            </div>
          </div>
        </div>
      `
    });

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Error en api/contacto.js:', error.message);
    return res.status(500).json({
      ok: false,
      error: 'No se pudo despachar el mensaje en este momento. Inténtalo de nuevo o escríbenos a info@apologeticaccar.com.'
    });
  }
}