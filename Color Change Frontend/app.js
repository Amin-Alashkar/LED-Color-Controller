function color_change(color) {
  fetch("http://10.220.1.123:8000/colors/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      hex_color: color,
    }),
  })
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
}

const colorDisplay = document.getElementById('colorDisplay');

    function color_change(color) {
        fetch("http://10.220.1.123:8000/colors/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                hex_color: color,
            }),
        })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
    }

    function changeColor(color) {
        document.body.style.background = color;
        document.body.style.boxShadow = `0 0 80px ${color}80 inset`;
        colorDisplay.style.background = color;
        colorDisplay.textContent = color.toUpperCase();
        document.getElementById('colorPicker').value = color;
        setTextColor(color);
        color_change(color); // Call the defined function instead
    }

    function updateColor(color) {
        changeColor(color);
    }

    function setTextColor(color) {
        const r = parseInt(color.substr(1,2), 16);
        const g = parseInt(color.substr(3,2), 16);
        const b = parseInt(color.substr(5,2), 16);
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        document.querySelector('h1').style.color = luminance > 0.5 ? '#333' : '#fff';
        document.querySelector('.card').style.background = luminance > 0.5 ? 'white' : 'rgba(0,0,0,0.7)';
    }

    changeColor('#ff0000');

    document.getElementById("lightOneBtn").addEventListener("click", function() {
        this.classList.toggle("light-one");
    });
