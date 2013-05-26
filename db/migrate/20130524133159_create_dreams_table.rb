class CreateDreamsTable < ActiveRecord::Migration
  def change
    create_table :dreams do |t|
      t.text :text
      t.timestamps
    end
  end
end
