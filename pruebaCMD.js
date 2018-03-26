var cmd=require('node-cmd');
 
    cmd.get(
        'java -jar ./PortableSigner/PortableSigner.jar -n -t ./pdfPrueba.pdf -o ./pdfPruebaFirmado.pdf -b es -c pruebaPHR -i ./livean.jpg -s ./certificate.p12 -p 13Julio2015  > allout.txt 2>&1',
        function(err, data, stderr){
            if (!err) {
               //console.log('respuesta:\n\n',data)

               //console.log(process.pid);
               var pid = process.pid;
               console.log(pid);
               //console.log(stdout); 

            } else {
               console.log('error', err)
            }
        }
    );


 
