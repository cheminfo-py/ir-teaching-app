# to be executed from the root level 

# update visualizer and install dependencies
cd html/visualizer  && rm -rf visualizer && rm -rf src
wget https://github.com/NPellet/visualizer/archive/refs/heads/master.zip && unzip master.zip
cd visualizer-master && npm i --force  && cd ..
mv visualizer-master/src . 
rm  src/node_modules && mv visualizer-master/node_modules src/ && rm -rf visualizer-master && rm master.zip

# update helper (https://github.com/cheminfo-js/visualizer-helper)
cd html/visualizer && rm -rf helper
wget https://github.com/cheminfo-js/visualizer-helper/archive/refs/heads/master.zip && unzip master.zip
mv visualizer-helper-master helper && rm master.zip