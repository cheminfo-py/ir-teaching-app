#to be executed from the root level 

# curl the view 
if [[ " $@ " =~ " view.json" ]]; then
   echo "view.json"
else
    curl https://couch.cheminfo.org/cheminfo-public/10b6a7229db7dd815afcc75e77c2d6cd/view.json > view.json
fi 

#find replace https://ir.cheminfo.org with http://localhost:8091
# the -i '' is required on Mac https://stackoverflow.com/questions/25486667/sed-without-backup-file
sed -i '' -e 's/https:\/\/ir.cheminfo.org/api/g' view.json

# #get the VH commit
VHCOMMIT=$(grep -o -E -e '\/github/cheminfo-js\/visualizer-helper/[0-9a-f]{40}'  view.json |  sed -e 's/\/.*\///g')

# move the view 
mv view.json html/visualizer/view.json

# update visualizer and install dependencies
cd html/visualizer  && rm -rf visualizer && rm -rf src 
wget https://github.com/NPellet/visualizer/archive/refs/heads/master.zip && unzip master.zip
cd visualizer-master && npm i --force  && npm run postinstall && npm run build && cd ..
mv visualizer-master/build src && cp src/browserified build 
rm -rf visualizer-master && rm master.zip
cd .. 