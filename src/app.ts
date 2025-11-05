import { ClientePostgres } from "./infraestructura/repositorios/repositorioClientePostgres";
import { CrearCliente } from "./aplicacion/casosUso/crearCliente";
import { ListarClientes } from "./aplicacion/casosUso/ListarClientes";

const repositorioCliente = new ClientePostgres();

(async () => {
    const crearCliente = new CrearCliente(repositorioCliente);

    const nuevoCliente = await crearCliente.ejecutar({
        nombreCliente: "Juan Perez",
        emailCliente: "juan@hotmail.com",
        telefonoCliente: "123456789",
        direccionCliente: "Calle 123"
    });
    console.log("Cliente creado:", nuevoCliente);
    const listarClientes = new ListarClientes(repositorioCliente);
    const clientes = await listarClientes.ejecutar();
    console.log("Lista de clientes:", clientes);
})();