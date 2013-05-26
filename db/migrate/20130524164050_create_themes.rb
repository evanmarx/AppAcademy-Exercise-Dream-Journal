class CreateThemes < ActiveRecord::Migration
  def change
    create_table :themes do |t|
      t.integer :dream_id
      t.string  :title
    end
  end
end
