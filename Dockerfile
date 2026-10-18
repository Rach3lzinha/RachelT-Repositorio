# Usa uma imagem leve do Nginx para servir arquivos estáticos
FROM nginx:alpine

# Copia os arquivos do seu projeto para a pasta do Nginx
COPY index.html /usr/share/nginx/html/
COPY style.css /usr/share/nginx/html/
COPY script.js /usr/share/nginx/html/

# Expõe a porta 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]