const { createClient } = require('@supabase/supabase-js');
const telegramBot = require('node-telegram-bot-api');
require('dotenv').config();
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const bot = new telegramBot(process.env.TOKEN, { polling: true });


bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    switch (text) {
        case '/librairie1':
            const { data : livre, error } = await supabase
                .from('venteLivre')
                .select('*, livres(*)')
                .eq('idAgence', 1)
                .eq('date', new Date().toISOString().slice(0, 10));

                let { data: echange, error1 } = await supabase
                .from('echange')
                .select("*, livres!echange_idLE_fkey(*)")
                .eq('date', new Date().toISOString().slice(0, 10))
                .eq('idAgence', 1);

                let { data: articles, error2 } = await supabase
                .from('venteArticle')
                .select('*, articles(*)')
                .eq('idAgence', 1)
                .eq('date', new Date().toISOString().slice(0, 10));
                
            if (error || error1 || error2) {
                bot.sendMessage(chatId, 'Une erreur est survenue appelles Savio +237 690295069');
            } else {
                let message = '';
                let somme = 0;
                let total = 0;

                message += `Jour ${new Date()}\n`;
                message += 'Vente de livres \n';

                if (livre.length > 0) {
                    livre.forEach(vente => {
                        message += `${vente.livres.nom} ---- ${vente.qte} = ${vente.prix}\n`;
                        somme += vente.prix;
                    });
                    message += `Total : ${somme} F CFA\n`;
                    total += somme;
                } else {
                    message += 'On n\'a pas vendu de livres aujourd\'hui \n';
                
                }
                
                
                somme = 0;
                message +='\n';
                message += '--------------------------------------------\n';
                message +='\n';
                message += 'Echange de livres \n';
                if (echange.length > 0) {
                    
                    echange.forEach(vente => {
                        message += `${vente.livres.nom} ---- ${vente.qte} = ${vente.prix}\n`;
                        somme += vente.prix;
                    });
                    message += `Total : ${somme} F CFA\n`;
                    total += somme;
                } else {
                    message += 'On n\'a pas fait d\'echange aujourd\'hui \n';
                }
                

                somme = 0;
                message +='\n';
                message += '--------------------------------------------\n';
                message +='\n';
                message += 'Ventes articles \n';
                if (articles.length > 0) {
                    articles.forEach(vente => {
                        message += `${vente.articles.nom} ---- ${vente.qte} = ${vente.prix}\n`;
                        somme += vente.prix;
                    });
                    message += `Total : ${somme} F CFA\n`;
                    total += somme;
                }else{
                    message += 'On n\'a pas vendu d\'article aujourd\'hui \n';
                }
                
                message += `On a eu au total : ${total} F CFA`

                bot.sendMessage(chatId, message);
                // bot.sendMessage(chatId, 'Welcome');
            }
            break;
        case '/quincaillerie1':
            let { data: produits, error11 } = await supabase
                .from('venteQuincaillerie')
                .select('*, produits(*)')
                .eq('idAgence', 1)
                .eq('date', new Date().toISOString().slice(0, 10));

            if (error11) {
                bot.sendMessage(chatId, 'Une erreur est survenue appellez Savio +237 690295069');
            } else { 
                message = '';
                message = '\n';
                somme = 0;
                total = 0;
                message += `Jour ${new Date()}\n`;
                message += 'Vente de livres \n';

                if (produits.length > 0) {
                    produits.forEach(vente => {
                        message += `${vente.livres.nom} ---- ${vente.qte} = ${vente.prix}\n`;
                        somme += vente.prix;
                    });
                    message += `Total : ${somme} F CFA\n`;
                    total += somme;
                } else {
                    message += 'On n\'a pas vendu aujourd\'hui \n';
                
                }
                message += `On a eu au total : ${total} F CFA`

                bot.sendMessage(chatId, message);
            }
            break;
            case '/manquelibrairie1':
                let { data: manqueLivreLibrairie1, error3 } = await supabase
                    .from('livres')
                    .select('*')
                    .eq('idAgence', 1)
                    .lt('quantite', 30);

                    let { data: manqueCahierLibrairie1, error4 } = await supabase
                    .from('articles')
                    .select('*')
                    .eq('idAgence', 1)
                    .lt('quantite', 3);
    
                if (error3) {
                    bot.sendMessage(chatId, 'Une erreur est survenue appellez Savio +237 690295069');
                } else { 
                    message = '';
                    message = '\n';
                    somme = 0;
                    total = 0;
                    message += `Jour ${new Date()}\n`;
                    message += 'Inventaire de livres \n';
    
                    if (manqueLivreLibrairie1.length > 0) {
                        manqueLivreLibrairie1.forEach(vente => {
                            message += `${vente.nom} ---- ${vente.quantite} ----- ${vente.prix}\n`;
                        });
                    } else {
                        message += 'Tout est encore bon\n';
                    
                    }
                    message +='\n';
                    message += '--------------------------------------------\n';
                    message +='\n';
                    message += 'Inventaire d\' articles \n';
                    if (manqueCahierLibrairie1.length > 0) {
                        manqueCahierLibrairie1.forEach(vente => {
                            message += `${vente.nom} ---- ${vente.quantite} ----- ${vente.prix}\n`;
                        });
                    }else{
                        message += 'Tout est encore bon\n';
                    }
                    
                    message +='\n';
                    message += '--------------------------------------------\n';
                    message +='\n';

                    bot.sendMessage(chatId, message);
                }
                break;
            case '/manquequincaillerie1': 
                let { data: manquequincaillerie1, error5 } = await supabase
                    .from('produits')
                    .select('*')
                    .eq('idAgence', 1)
                    .lt('quantite', 3);
    
                if (error5) {
                    bot.sendMessage(chatId, 'Une erreur est survenue appellez Savio +237 690295069');
                } else { 
                    message = '';
                    message = '\n';
                    somme = 0;
                    total = 0;
                    message += `Jour ${new Date()}\n`;
                    message += 'Inventaire de Produis \n';
    
                    if (manquequincaillerie1.length > 0) {
                        manquequincaillerie1.forEach(vente => {
                            message += `${vente.nom} ---- ${vente.quantite} ----- ${vente.prix}\n`;
                        });
                    } else {
                        message += 'Tout est encore bon\n';
                    
                    }
                    
                    message +='\n';
                    message += '--------------------------------------------\n';
                    message +='\n';

                    bot.sendMessage(chatId, message);
                }
                break;
        default: 
            bot.sendMessage(chatId, 'Bienvenue Mr pour le moindre probleme veuillez contacter Savio +237 690295069'); 
    }
});

