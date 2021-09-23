# to be executed from the root level 

# update visualizer
cd html/visualizer  && rm -rf visualizer && rm -rf src
wget https://github.com/NPellet/visualizer/archive/refs/heads/master.zip && unzip master.zip
mv visualizer-master/src . && rm -rf visualizer-master && rm master.zip

# update helper (https://github.com/cheminfo-js/visualizer-helper)
cd html/visualizer && rm -rf helper
wget https://github.com/cheminfo-js/visualizer-helper/archive/refs/heads/master.zip && unzip master.zip
mv visualizer-helper-master helper && rm master.zip