# REACT

Documentación:

Aplicación web para gestionar billeteras virtuales, estructa sencilla de components y router con una patantalla principal, desarrollada con React y conectada a un backend.

cumple con la siguiente Funcionalidades:

1. Registro Clientes:
    Crear un método llamado registro cliente donde reciba los siguientes parámetros:

        • Documento
        • Nombres,
        • Email,        
        • Celular

    Se debe registrar el usuario, todos los campos son requeridos, el servicio debe
    dar como resultado un mensaje con su respectivo código de error y mensaje de
    éxito o fallo.

2. Recarga Billetera:
    Se debe permitir cargar la billetera enviando el documento, número de celular y
    valor, se debe responder un mensaje de éxito o fallo.

3. Pagar:
    La billetera con saldo debe permitir pagar una compra enviada, pero para
    descontar el saldo el sistema deberá generar un token de 6 dígitos el cual deben
    de confirmar enviando un id de sesión y el token. Se sugiere enviar el token al
    email del usuario registrado.
    Si todo es correcto se genera un mensaje y una respuesta diciendo que se ha
    enviado un correo más el id de sesión que debe ser usado en la confirmación de
    la compra.

    Confirmar Pago.
    Esta función valida el id de sesión generado en la compra, valida el token enviado
    al usuario al correo, si es correcto el dinero se descuenta de la billetera y se
    genera el respectivo mensaje de éxito o fallo.

4. Consultar Saldo.
    Para consultar el saldo se debe enviar el documento y numero de celular, estos
    dos valores deben coincidir.

# para ejecutar el backend:

instalar dependencia:

- En la terminal de la raiz del proyecto:

    ```bash    
    npm install
    ```

- ejecutar proyecto con:

    ```bash    
    npm run start
    ```