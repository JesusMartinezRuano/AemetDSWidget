% ejecutar en cada carpeta
% cambia el nombre por su MD5

for i in *; do sum=$(echo -n "$i"|md5sum); mv -- "$i" "${sum%% *}.${i##*.}"; done