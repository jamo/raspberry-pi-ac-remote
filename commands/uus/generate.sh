#!/bin/bash

echo "
begin remote

  name  PI
  flags RAW_CODES
  eps            30
  aeps          100

  gap          450
  frequency    38000

      begin raw_codes
"


for dir in $(ls  ) ; do
	if [[ $dir == $0 ]]; then
		continue
	fi

	for file in $dir/*; do 
		cmd=$(cat $file | cut -f 2 -d ' ' | tr '\n' ' ')
		
		cmdname=$(echo $file | sed 's/\///')
		echo "        name $cmdname"
		echo "$cmd"

		
	done	
done

echo "      end raw_codes
end remote"
