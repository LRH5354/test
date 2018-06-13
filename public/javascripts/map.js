$(document).ready(function() {
	$(' .list-group-item').on('click',function(e){

		for(var i=0;i<$(this).siblings().length;i++){
	        $($(this).siblings()[i]).removeClass('active');
		}

		$(this).addClass('active');
	})

})