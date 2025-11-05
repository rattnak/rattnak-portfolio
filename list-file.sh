folders=("app" "src" "components" "lib" "styles")

for folder in "${folders[@]}"; do
  if [ -d "$folder" ]; then
    echo ""
    echo "📁 $folder/"
    # Use find to list recursively, ignoring the root itself
    find "$folder" -mindepth 1 | sed -e "s|[^/]*/|  |g" -e "s|  \([^/]*\)$|  ├── \1|"
  fi
done