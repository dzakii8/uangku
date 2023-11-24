function now(now) {
    
    let date = now;
    let tahun = date.getFullYear();
let bulan = date.getMonth();
let tanggal = date.getDate();
let hari = date.getDay();
let jam = date.getHours();
let menit = date.getMinutes();
let detik = date.getSeconds();
switch(hari) {
    case 0: hari = "Minggu"; break;
    case 1: hari = "Senin"; break;
    case 2: hari = "Selasa"; break;
 case 3: hari = "Rabu"; break;
 case 4: hari = "Kamis"; break;
 case 5: hari = "Jum'at"; break;
 case 6: hari = "Sabtu"; break;
}
switch(bulan) {
    case 0: bulan = "01"; break;
    case 1: bulan = "02"; break;
    case 2: bulan = "03"; break;
    case 3: bulan = "04"; break;
    case 4: bulan = "05"; break;
    case 5: bulan = "06"; break;
    case 6: bulan = "07"; break;
    case 7: bulan = "08"; break;
    case 8: bulan = "09"; break;
    case 9: bulan = "10"; break;
    case 10: bulan = "11"; break;
    case 11: bulan = "12"; break;
}
if(menit.length == 1){
    menit = `0${menit}`
}
if(jam.length !== 2){
    jam = `0${jam}`
}
let tampilTanggal =`${tahun}-${bulan}-${tanggal}`
let tampilWaktu =jam+ ":" + menit;
return `${tampilTanggal}T${tampilWaktu}`
}

module.exports = now
// console.log(tampilTanggal);
// console.log(tampilWaktu);
// console.log(new Date());
// "1914-12-20 08:30:45"