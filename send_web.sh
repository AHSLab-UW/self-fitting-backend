cd ../self-fitting-gui
npm run build
cd ../self-fitting-backend
scp -r ./dist mha@10.0.0.1:/home/mha/self-fitting-backend
