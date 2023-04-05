cd ../self-fitting-gui
npm run build
cd ..
scp -r self-fitting-backend mha@10.0.0.1:/home/mha
cd self-fitting-backend

# /etc/systemd/system/multi-user.target.wants/mahalia-nodered.service.