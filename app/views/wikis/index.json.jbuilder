json.array!(@wikis) do |wiki|
  json.extract! wiki, :id, :title, :body
  json.url wiki_url(wiki, format: :json)
end
