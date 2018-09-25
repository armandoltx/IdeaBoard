10.times do |idea|
  Idea.create!(
    title: "My Idea #{idea}",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam sagittis lacus eu erat malesuada pretium quis vel nisl."
  )
  end

puts "Ideas Created"