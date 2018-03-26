'use strict';

const express = require('express');
const stream = require('stream');
const delay = require('delay');
var bodyParser = require('body-parser')
var cmd=require('node-cmd')
var fs = require("fs"); //Load the filesystem module
var path = require('path');

var SSH2Utils = require('ssh2-utils');
	    var ssh = new SSH2Utils();

	    var server = {host: "sftp19.sapsf.com", username:"1212045T", password:"m7wXkp5qVcuEP" };

// Constants
const PORT = 9999;
const HOST = '0.0.0.0';

// App
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());




var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)

/*router.post("/firmar", function(request, response) {
       console.log(request.body); //This prints the JSON document received (if it is a JSON document)
 });
 */

 router.get('/visualizar', function(req,res) {
 	var url = require('url');
	var url_parts = url.parse(req.url, true);
	var query = url_parts.query;

	var RUTpdfFirmar = req.query.rutpdf;
	var nota = req.query.nota;

	var id = req.query.id; // $_GET["id"]


	console.log(id);

 	ssh.getFile(server,'/pruebaPDF/'+id+'.pdf','./'+id+'.pdf', function(err){
	        if(err){ 
	        	console.log(err);
	        }
	         else {
	 			console.log('PDF cargado OK: ' +id+'.pdf');

	 			var archivo = id + '.pdf';
    			var file = fs.createReadStream('./' + archivo);
				var stat = fs.statSync('./' + archivo);
							//res.setHeader('Content-Length', stat.size);
				res.setHeader('Content-Type', 'application/pdf');
							//res.setHeader('Content-Disposition', 'attachment; filename='+archivo);
				file.pipe(res);
			};
	 });



 });


router.get('/firmar', function(req, res) {
    
	var url = require('url');
	var url_parts = url.parse(req.url, true);
	var query = url_parts.query;

	var RUTpdfFirmar = req.query.rutpdf;
	var nota = req.query.nota;

	var id = req.query.id; // $_GET["id"]
	var clave = req.query.clave; // $_GET["clave"]
	var motivo = req.query.motivo; // $_GET["motivo"]
	var certificado = id+".p12";
	var imagen = id+".jpg";


	
		
	ssh.getFile(server,'/pruebaPDF/'+id+'.pdf','./'+id+'.pdf', function(err){
	        if(err){ 
	        	console.log(err);
	        }
	         else {
	 			
	         	ssh.getFile(server,'/pruebaPDF/certificados/'+id+'.p12','./'+id+'.p12', function(err){
	         		 if(err){ 
	        			console.log(err);
	        		}
	        		else{

	        				ssh.getFile(server,'/pruebaPDF/firmas/'+id+'.jpg','./'+id+'.jpg', function(err){
	        				 if(err){ 
	        					console.log(err);
	        				}
	        			else{

	        					        // despues de 10 segundos

        		var comando = 'java -jar ./PortableSigner/PortableSigner.jar -n -t '+ './' + id + '.pdf -o ./' + id + 'Firmado.pdf -b es -c '+motivo+' -i ./'+imagen+' -s ./'+certificado+' -p '+clave+'  > '+id+'.txt 2>&1';

				cmd.get(
			        comando,
			        function(err, data, stderr){
			            if (!err) {




			               var pid = process.pid;
			               console.log('Id de proceso: ' + pid);



			               var archivo = id + 'Firmado.pdf';

			               if (fs.existsSync(archivo)) {
    // Do something
							var stats = fs.statSync('./' + id + 'Firmado.pdf');
						   var fileSizeInBytes = stats["size"]


						  /*ssh.putFileSudo(server,'./'+id+'Firmado.pdf','/pruebaPDF/'+id+'Firmado1.pdf', function(err){
       						 if(err) console.log(err);
    							});
    							*/

    						let Client = require('ssh2-sftp-client');
							let sftp = new Client();
							
							sftp.connect({
							    host: 'sftp19.sapsf.com',
							    port: '22',
							    username: '1212045T',
							    password: 'm7wXkp5qVcuEP'
							}).then(() => {

							    return sftp.list('/pruebaPDF');
							    
							}).then((data) => {
								
							
						  		sftp.put('./'+id+'Firmado.pdf', '/pruebaPDF/'+id+'Firmado2.pdf', null, null).then((data) => {
									console.log(data, 'se deja firmado PDF en FTP');
						  			});

							    //console.log(data, 'the data info');
							    
							    });
						

						var file = fs.createReadStream('./' + archivo);
							var stat = fs.statSync('./' + archivo);
							//res.setHeader('Content-Length', stat.size);
							res.setHeader('Content-Type', 'application/pdf');
							//res.setHeader('Content-Disposition', 'attachment; filename='+archivo);
							file.pipe(res);
							
							var borrar = 'rm '+id+'*';

			        			cmd.get(
						        borrar,
						        function(err, data, stderr){
						            console.log('Archivos temporales eliminados '+id);
						        }
   								 );

							}
							else{
								console.log('Error Firmando! '+ id);

			            	var filePath = id+'.txt';




							var file = fs.createReadStream('./' + filePath);
							var stat = fs.statSync('./' + filePath);
							//res.setHeader('Content-Length', stat.size);
							res.setHeader('Content-Type', 'text/html');
							//res.setHeader('Content-Disposition', 'attachment; filename='+archivo);
							file.pipe(res);
							
		




							}


			            } else {
			            	

			            	console.log('Error Firmando! '+ id, err)

			            	var filePath = id+'.txt';

					        fs.readFile(__dirname + filePath , function (err,data){
					            res.contentType("content/html");
					            res.send(data);
					        });

			               
			            }
			        }
    );

	        				}
				 			
				 			});
	        			
	        		}
	        		});

			};
	 });


	


	/*delay(10000)
    .then(() => {

    });*/


});

app.use('/', router);

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);