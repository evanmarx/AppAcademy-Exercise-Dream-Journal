class Dream < ActiveRecord::Base
  attr_accessible :text

  has_many :themes

  accepts_nested_attributes_for :themes

  # validates :text, :presence => true
end