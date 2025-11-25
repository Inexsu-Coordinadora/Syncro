import { crearServidorBase } from "./interfaces/servidor";

const PORT = 3000;

const start = async () => {
    try {
      
        const app = crearServidorBase(); 
        
        
        await app.listen({ port: PORT });
        
        console.log(`🚀 Servidor de Proyectos iniciado en http://localhost:${PORT}`);
        
    } catch (err) {
        console.error("[ERROR] Fallo al iniciar el servidor:", err);
        process.exit(1);
    }
};

start();