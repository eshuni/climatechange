cd "$(dirname "$0")"
cd ..
python ./src/transforms/crudeoil.py
python ./src/transforms/soybeans.py
python ./src/transforms/iowa.py
python ./src/transforms/illinois.py
python ./src/load.py
