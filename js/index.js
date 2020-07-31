$(function () {
    $("[data-toggle='tooltip']").tooltip();
    $("[data-toggle='popover']").popover();
    //Para manejar los tiempos del carousel
    $('.carousel').carousel({
        interval: 2000
    });
    //#region 
    /*Usamos el Id del Modal
    $('#contacto').on('show.bs.modal', function(e){
      console.log('el modal se está mostrando');
  
      // $('#contactobtn').removeClass('btn-outline-success')
      // $('#contactobtn').addClass('btn-primary') 
  
      $('#contactobtn').prop('disabled', true)
  
    })
    //Aqui se muestra despues de abrirse
    $('#contacto').on('shown.bs.modal', function(e){
      console.log('el modal se mostro');
    })
  
    $('#contacto').on('hide.bs.modal', function(e){
      console.log('el modal se oculta');
    })
    //Aqui se muestra despues de ocultarse
    $('#contacto').on('hidden.bs.modal', function(e){
      console.log('el modal se ocultó');
      $('#contactobtn').prop('disabled', false)
    })*/

    //#endregion

})  