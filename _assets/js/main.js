var contactForm = $('#contact-form');

contactForm.submit(function(e){
  e.preventDefault()
  var message = contactForm.serialize();
  $.ajax({
    url: "https://formspree.io/casimcdaniels@gmail.com",
    method: "POST",
    data: message,
    dataType: "json",

    beforeSend: function() {
			   $("#submit-contact-form").val("Sending...");
        //contactForm.append('<div class="alert alert-loading">Sending message…</div>');
		},
		success: function(data) {
      $("#submit-contact-form").val("Thanks!");
      setTimeout(function(){
        $("#submit-contact-form").val("Submit");
      }, 2000);
			//contactForm.find('.alert-loading').hide();
			//contactForm.append('<div class="alert alert-success">Message sent!</div>');
		},
		error: function(err) {
      $("#submit-contact-form").val("Oops, could not send.");
      setTimeout(function(){
        $("#submit-contact-form").val("Submit");
      }, 2000);
			//contactForm.find('.alert-loading').hide();
			//contactForm.append('<div class="alert alert-error">Ops, there was an error.</div>');
		}
  });
  return false;
});
