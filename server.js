const express = require('express');
const dgram = require('dgram');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 8000;

// Dirección y puerto del servidor UDP
const UDP_SERVER_HOST = '192.168.1.110'; // Cambia esto a la IP del servidor UDP si es necesario
const UDP_SERVER_PORT = 3333; // Cambia esto al puerto configurado en tu servidor UDP

// Option 1: Allow all origins
app.use(cors());

app.use(bodyParser.json());

app.post('/api/v1/posicion', (req, res) => {
    const { e, d, r, m } = req.body;

    console.log('Received request:', { e, d, r, m });

    if (typeof e !== 'number' || typeof d !== 'number' || typeof r !== 'number' || typeof m !== 'number') {
        return res.status(500).send('Invalid request format');
    }


    const message = JSON.stringify({ e, d, r, m });
    const client = dgram.createSocket('udp4');

    client.send(message, UDP_SERVER_PORT, UDP_SERVER_HOST, (err) => {
        client.close();
        if (err) {
            console.error('UDP message send error', err);
            return res.status(500).send('Failed to send UDP message');
        }
        res.status(200).send('UDP message sent');
    });
});

app.get('/api/v1/posicion', (req, res) => {
    res.status(200).send('API is running');
}, (error, req, res, next) => {
    console.error(error);
    res.status(500).send('Internal server error');
}
);

// Servir archivos estáticos desde la carpeta 'dist'
app.use(express.static(path.join(__dirname, 'dist')));

// Para cualquier otra ruta, devolver el archivo index.html de 'dist'
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Express server is running on port ${PORT}`);
});
