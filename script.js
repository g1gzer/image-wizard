const html = document.querySelector('html');
const ranges = document.querySelectorAll('.range');
const rangeOuts = document.querySelectorAll('output');

const reset = document.getElementById('btnReset');

const imageLoad = document.querySelector('input[type="file"]');

const NextImg = document.getElementById('btnNext');

const canvasBuffer = document.getElementById('canvas');
const context = canvasBuffer.getContext('2d');
const download = document.getElementById('download');


const API_KEY = '21398887-696efe5fc51247b1eed336ea2'; //pixabay API key


const themeToggle = document.getElementById('cbx');


// Image Loader
const img = new Image(); // Canvas image


imageLoad.addEventListener('change', (e) => {
    const file = imageLoad.files[0];
    const reader = new FileReader();
    reader.onload = () => {
        drawImage(reader.result);  // Canvas image load
    }
    reader.readAsDataURL(file);
});

// Time control & Pixabay API request

let currentDayTime;
const currentDate = new Date();

if (6 <= currentDate.getHours() && currentDate.getHours() <= 11) {
    currentDayTime = 'morning';
} else if (12 <= currentDate.getHours() && currentDate.getHours() <= 17) {
    currentDayTime = 'noon';
} else if (18 <= currentDate.getHours() && currentDate.getHours() <= 23) {
    currentDayTime = 'sunset';
} else if (0 <= currentDate.getHours() && currentDate.getHours() <= 5) {
    currentDayTime = 'night';
}


let AccumArr = []; // pixabay images src accumulator
let pixabayUrl = `https://pixabay.com/api/?key=${API_KEY}&q=${currentDayTime}&image_type=photo&pretty=true&safesearch=true&orientation=horizontal&order=popular&min_height=1080`; //pixabay API src

async function fetchPixabay() {
    const response = await fetch(pixabayUrl);
    const result = await response.json()
    await result.hits.forEach(el => {
        AccumArr.push(el.largeImageURL);
    })
    drawImage(AccumArr[0]);
}
fetchPixabay();

// Canvas drawImage func

function drawImage(path) {

    img.setAttribute('crossOrigin', 'anonymous');
    img.src = path;
    img.onload = function () {
        canvasBuffer.width = img.width;
        canvasBuffer.height = img.height;
        context.filter = canvasfilterInfo;
        context.drawImage(img, 0, 0);
    };

}

// Next image toggle
let i = 0; // simple counter
NextImg.addEventListener("mousedown", () => {
    imageLoad.value = "";  // image load value reset

    if (img.src === AccumArr[19]) {
        i = 0;
        drawImage(AccumArr[i])
    } else {
        i = i + 1
        drawImage(AccumArr[i])
    }
    dragReset();
});

// Image download toggle
download.addEventListener('mousedown', function (e) {
    let link = document.createElement('a');
    link.download = 'new-img.png';
    link.href = canvasBuffer.toDataURL();
    link.click();
    link.delete;
});


// Ranges handler
let canvasfilterInfo;
let blurOutput = '',
    invertOutput = '',
    sepiaOutput = '',
    saturateOutput = '',
    hueOutput = ''

let canvasFiltersHandler = (name, value) => {
    let blur = '',
        blurValue = '',
        invert = '',
        invertValue = '',
        sepia = '',
        sepiaValue = '',
        saturate = '',
        saturateValue = '',
        hue = '',
        hueValue = ''

    if (name === 'blur') {
        blur = name;
        blurValue = value;
        blurOutput = ` ${blur}(${blurValue})`;
    } else if (name === 'invert') {
        invert = name
        invertValue = value;
        invertOutput = ` ${invert}(${invertValue})`;
    } else if (name === 'sepia') {
        sepia = name
        sepiaValue = value;
        sepiaOutput = ` ${sepia}(${sepiaValue})`;
    } else if (name === 'saturate') {
        saturate = name
        saturateValue = value;
        saturateOutput = ` ${saturate}(${saturateValue})`;
    } else if (name === 'hue') {
        hue = name
        hueValue = value;
        hueOutput = ` ${hue}-rotate(${hueValue})`;
    }
    canvasfilterInfo = blurOutput + invertOutput + sepiaOutput + saturateOutput + hueOutput;
}

function dragHandler() {
    const suffix = this.dataset.sizing || '';
    canvasFiltersHandler(this.name, this.value + suffix);
    drawImage(img.src);
    rangeOuts.forEach(item => {
        if (item.name === 'result-' + this.name) {
            item.innerText = this.value;
        }
    });
}

ranges.forEach(item => {
    item.addEventListener('change', dragHandler);
    item.addEventListener('mousemove', dragHandler);
});


// Filters Reset

let dragReset = () => {
    canvasfilterInfo = '';
    blurOutput = '';
    invertOutput = '';
    sepiaOutput = '';
    saturateOutput = '';
    hueOutput = '';
    drawImage(img.src)  // img.src - current image src in canvas
    rangeOuts.forEach(item => {
        item.name === 'result-saturate' ? item.innerText = '100' : item.innerText = '0';
    });
    ranges.forEach(item => {
        item.name === 'saturate' ? item.value = 100 : item.value = 0;
    });
}

reset.addEventListener('mousedown', dragReset);


// Fullscreen toggle
const openFull = document.querySelector(".fullscreen");

openFull.onclick = () => {
    document.documentElement.webkitRequestFullscreen();
    document.webkitExitFullscreen();
};

// Theme change toggle
let themeSwitch = () => {
    if (themeToggle.checked) {
        html.classList.add("light-mod")
    } else {
        html.classList.remove("light-mod")
    }
}
themeToggle.addEventListener('change', themeSwitch)
