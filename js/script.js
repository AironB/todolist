const CLAVE_LOCALSTORAGE = "lista_tareas";
document.addEventListener("DOMContentLoaded",() => {
    let tareas=[];//El arreglo global que vamos a manejar
    //declaracion de elementos al DOM
    const $contenedorTareas = document.querySelector("#contenedorTareas"),
   // $BuscarTarea = document.querySelector("#BuscarTarea"),
    $btnGuardarTarea = document.querySelector("#btnAgregarTarea"),
    $BuscarTarea=document.querySelector("#BuscarTarea"),
    $btnBuscartarea=document.querySelector("#btnBuscarTarea"),
    $inputNuevaTarea = document.querySelector("#inputNuevaTarea"),
    $btnEliminarTareas=document.querySelector("#btnEliminarTareas");
    
    $btnBuscartarea.onclick=()=>{
        var contador;
        const tarea=$BuscarTarea.value;
        //console.log(tarea)
        var encontrado;  
        if(!tarea){
                    return;
                  }
                    for (contador=0;contador<tareas.length;contador++)
                        {
                        if(tareas[contador]==tarea)
                            {
                                encontrado=contador;
                                break;
                            }    
                        }
            if(encontrado==-1)
                {
                    console.log(encontrado)
            alert("No se a encontrado la tarea "+tarea+"");
                 }
            
            alert("la tarea "+tarea+" esta en la posicion[ "+encontrado+" ]");
    }
    //esto nos sirve para eliminar todas las tareas de un solo
    $btnEliminarTareas.onclick=()=>
    {
        var opcion =confirm("Seguro");
        if (opcion==true){
            
          while(tareas.length>0){
                tareas.pop();
                        }
            
            refrescarListaDeTareas();
        }
    
    }
    //escuchar click del botón para agregar nueva tarea;
    $btnGuardarTarea.onclick=()=>{
        const tarea=$inputNuevaTarea.value;
        if(!tarea){
            
          return;
        
        }
        tareas.push({
            tarea: tarea,
            terminada: false,
            
        });

        $inputNuevaTarea.value="";

        guardarTareasEnAlmacenamiento();
        refrescarListaDeTareas();
    };
//tecla enter
    document.addEventListener("keydown", function(event){
        if(event.key==="Enter"){
            const tarea=$inputNuevaTarea.value;
            if(!tarea){
                return;
            }
            tareas.push({
                tarea: tarea,
                terminada: false,
            });
            $inputNuevaTarea.value="";
    
            guardarTareasEnAlmacenamiento();
            refrescarListaDeTareas();
        }
    });
    
    const obtenerTareasEnAlmacenamiento=()=> {
        const posibleLista=JSON.parse(localStorage.getItem(CLAVE_LOCALSTORAGE));
        if(posibleLista){
            return posibleLista;
        }else{
            return[];
        }
    };
    const guardarTareasEnAlmacenamiento=()=>{
        localStorage.setItem(CLAVE_LOCALSTORAGE, JSON.stringify(tareas));
    };

    //definimos la funcion que refresca la lista de tareas a partir del arreglo global
    const refrescarListaDeTareas=()=>{
        $contenedorTareas.innerHTML="";
        for(const [indice, tarea] of tareas.entries()){
            //crear enlace para eliminar la tarea
            const $enlaceParaEliminar = document.createElement("a");
            
            $enlaceParaEliminar.classList.add("enlace-eliminar");
            $enlaceParaEliminar.innerHTML="&times;";
            $enlaceParaEliminar.href="";
            $enlaceParaEliminar.onclick=(evento)=>{
                evento.preventDefault();
                if(!confirm("¿Eliminar tarea?")){
                    return;
                }
                tareas.splice(indice, 1);
                //guardar los cambios
                guardarTareasEnAlmacenamiento(tareas);
                refrescarListaDeTareas();
                
            };
            
           
            //el input para marcar la tarea como terminada
            const $checkbox=document.createElement("input");
            $checkbox.type="checkbox";
            $checkbox.onchange=function(){//No es una funcion flecha porque se accedera al elemento por medio de this
                    if(this.checked){
                        tareas[indice].terminada=true;
                    }else{
                        tareas[indice].terminada=false;
                    }
                    guardarTareasEnAlmacenamiento(tareas);
                    refrescarListaDeTareas();
            }
            //el span que llevare el contenido de la tarea
            const $span = document.createElement("span")
            $span.textContent=tarea.tarea;
            //y finalmente el elemento de la lista
            const $li =document.createElement("li");
            //verifiquemos si la tarea esta marcada para marcar los elementos
            if(tarea.terminada){
                $checkbox.checked=true;
                $span.classList.add("tachado");
            }
            $li.appendChild($checkbox);
            $li.appendChild($span);
            $li.appendChild($enlaceParaEliminar);
            $contenedorTareas.appendChild($li);
        }
    };
    //llamar a la funcion la primera vez
    tareas = obtenerTareasEnAlmacenamiento();
    refrescarListaDeTareas();
});