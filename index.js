const axios = require('axios');
const cheerio = require('cheerio');

const fetchData = async(url) => {
  const result = await axios.get(url);
  return result.data;
}

const getPage = async(url) => {
  const content = await fetchData(url + "?sc=3");
  if(!content) throw "Página não encontrada";
  return cheerio.load(content);
}

const getProductInfo = ($, url) => {
  const element = $('section.product-info');
  const name = $(element).find('div.productName').text();
  const price = $(element).find('em.valor-por').text();
  const img_url =  $(element).find('a.image-zoom').attr('href')
  
  return JSON.stringify({
    name,
    img_url,
    price: price 
    ? parseFloat(price.split('R$ ').pop().replace(',', '.')) 
    : undefined,
    product_availability: !!price,
    url
  });
}

const scrapPages = async () => {
  const sucoGoiabaUrl = "https://www.comperdelivery.com.br/suco-del-valle-frut-1l-pet-goiaba/p";
  const espumanteUrl = "https://www.comperdelivery.com.br/espumante-garibaldi-vero-brut-rose-750ml/p";
  const macaUrl = "https://www.comperdelivery.com.br/maca-dpa-sacolinha---1kg/p";

  const $_suco_goiaba_page = await getPage(sucoGoiabaUrl);
  const $_espumante_page = await getPage(espumanteUrl);
  const $_maca_page = await getPage(macaUrl);

  const sucoGoiabaInfo = getProductInfo($_suco_goiaba_page, sucoGoiabaUrl); 
  const espumanteInfo = getProductInfo($_espumante_page, espumanteUrl); 
  const macaInfo = getProductInfo($_maca_page, macaUrl); 

  console.log(sucoGoiabaInfo)
  console.log(espumanteInfo)
  console.log(macaInfo)
};

scrapPages();
