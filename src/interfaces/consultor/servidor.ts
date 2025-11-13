import Fastify from "fastify";
import consultorRutas from "./rutas/consultorRutas";


const app = Fastify({ logger: true });

app.register(consultorRutas, { prefix: "/api" });

const start = async () => {
  try {
    await app.listen({ port: 3000 });
    console.log("🚀 Servidor escuchando en http://localhost:3000");
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();