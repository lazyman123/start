modules=$(ls fekit-cache)
for module in ${modules}
do
    cd fekit-cache/$modules
    fekit publish
    cd ../../
done
