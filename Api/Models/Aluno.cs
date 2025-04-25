using System;
using System.ComponentModel.DataAnnotations;


namespace Api.Models
{
    public class Aluno
    {
        public int Id { get; set; }

        [Required]
        public string Nome { get; set; }

        [EmailAddress]
        public string Email { get; set; }

        public DateTime DataNascimento { get; set; }
    }
}