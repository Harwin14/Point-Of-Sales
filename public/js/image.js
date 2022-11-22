imgInp.onchange = evt => {
    const [file] = imgInp.files
    if (file) {
        blah.src = URL.createObjectURL(file)
    }
}
$('.custom-file-input').on('change', function () {
    let sampleFile = $(this).val().split('\\').pop();
    $(this).next('.custom-file-label').addClass("selected").html(sampleFile);
});