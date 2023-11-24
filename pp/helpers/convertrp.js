function formatRupiah(price) {
    let dataSalary = new Intl.NumberFormat('id-ID', {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 2
    }).format(price)
  
    return dataSalary
  }
  
  module.exports = formatRupiah